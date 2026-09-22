import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CampaignFilterDto } from './dto/campaign-filter.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';

type RequirementsJson = {
  mustStaySubscribed?: boolean;
  holdHours?: number;
  newMembersOnly?: boolean;
  minAccountAgeDays?: number;
  maxCompletionsPerUser?: number;
  category?: string;
  difficulty?: string;
  tags?: string[];
  estimatedMinutes?: number;
  rewardLabel?: string;
  channelDescription?: string;
};

type CampaignWithChannel = Prisma.CampaignGetPayload<{
  include: { channel: true; _count: { select: { completions: true } } };
}>;

type CampaignStats = {
  started: number;
  verified: number;
  onHold: number;
  completed: number;
  failed: number;
  cancelled: number;
};

const EMPTY_STATS: CampaignStats = {
  started: 0,
  verified: 0,
  onHold: 0,
  completed: 0,
  failed: 0,
  cancelled: 0,
};

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: CampaignFilterDto) {
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        ...(filter.status ? { status: filter.status as never } : {}),
        ...(filter.type ? { type: filter.type as never } : {}),
      },
      include: {
        channel: true,
        _count: { select: { completions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map((campaign) => this.toEarnerTask(campaign));
  }

  async findById(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        channel: true,
        _count: { select: { completions: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.toEarnerTask(campaign);
  }

  async adminFindAll() {
    const campaigns = await this.prisma.campaign.findMany({
      include: {
        channel: true,
        _count: { select: { completions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const stats = await this.statsByCampaign(campaigns.map((c) => c.id));
    return campaigns.map((campaign) =>
      this.toAdminCampaign(campaign, stats.get(campaign.id) ?? EMPTY_STATS),
    );
  }

  async adminFindById(id: string) {
    const campaign = await this.requireCampaign(id);
    const stats = await this.statsByCampaign([id]);
    return this.toAdminCampaign(campaign, stats.get(id) ?? EMPTY_STATS);
  }

  async completions(campaignId: string) {
    await this.requireCampaign(campaignId);
    const rows = await this.prisma.completion.findMany({
      where: { campaignId },
      include: { user: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });

    return rows.map((row) => ({
      id: row.id,
      campaignId: row.campaignId,
      telegramId: Number(row.user.telegramId),
      username: row.user.username ?? undefined,
      displayName: row.user.displayName,
      status: row.status,
      verifiedAt: row.verifiedAt?.toISOString(),
      holdReleaseAt: row.holdReleaseAt?.toISOString(),
      rewardAmount: Number(row.rewardAmount),
      currency: row.rewardCurrency,
    }));
  }

  async create(dto: CreateCampaignDto) {
    const channel = await this.upsertChannel(dto);
    const campaign = await this.prisma.campaign.create({
      data: this.campaignData(dto, channel.id),
      include: {
        channel: true,
        _count: { select: { completions: true } },
      },
    });
    return this.toAdminCampaign(campaign, EMPTY_STATS);
  }

  async update(id: string, dto: UpdateCampaignDto) {
    await this.requireCampaign(id);
    const channelId =
      dto.channelUsername || dto.channelTitle || dto.channelMemberCount != null
        ? (await this.upsertChannelFromPartial(dto)).id
        : undefined;

    const campaign = await this.prisma.campaign.update({
      where: { id },
      data: {
        ...(channelId ? { channelId } : {}),
        ...(dto.title != null ? { title: dto.title } : {}),
        ...(dto.shortDescription != null ? { shortDescription: dto.shortDescription } : {}),
        ...(dto.description != null ? { description: dto.description } : {}),
        ...(dto.type != null ? { type: dto.type } : {}),
        ...(dto.sponsorName != null ? { sponsorName: dto.sponsorName } : {}),
        ...(dto.rewardAmount != null ? { rewardAmount: dto.rewardAmount } : {}),
        ...(dto.rewardCurrency != null ? { rewardCurrency: dto.rewardCurrency } : {}),
        ...(dto.holdHours != null ? { holdHours: dto.holdHours } : {}),
        ...(dto.slotsTotal != null ? { slotsTotal: dto.slotsTotal } : {}),
        ...(dto.referralTarget != null ? { referralTarget: dto.referralTarget } : {}),
        ...(dto.affiliateUrl !== undefined ? { affiliateUrl: dto.affiliateUrl || null } : {}),
        ...(dto.requirements != null
          ? { requirements: dto.requirements as unknown as Prisma.InputJsonValue }
          : {}),
        ...(dto.rules != null ? { rules: dto.rules } : {}),
        ...(dto.status != null ? { status: dto.status } : {}),
        ...(dto.startAt != null ? { startAt: new Date(dto.startAt) } : {}),
        ...(dto.endAt != null ? { endAt: new Date(dto.endAt) } : {}),
      },
      include: {
        channel: true,
        _count: { select: { completions: true } },
      },
    });

    const stats = await this.statsByCampaign([id]);
    return this.toAdminCampaign(campaign, stats.get(id) ?? EMPTY_STATS);
  }

  async remove(id: string) {
    await this.requireCampaign(id);
    const completions = await this.prisma.completion.findMany({
      where: { campaignId: id },
      select: { id: true },
    });
    const completionIds = completions.map((completion) => completion.id);

    await this.prisma.$transaction(async (tx) => {
      await tx.referral.deleteMany({
        where: {
          OR: [{ campaignId: id }, { referredCompletionId: { in: completionIds } }],
        },
      });
      if (completionIds.length > 0) {
        await tx.ledgerEntry.deleteMany({ where: { completionId: { in: completionIds } } });
        await tx.completion.deleteMany({ where: { id: { in: completionIds } } });
      }
      await tx.campaign.delete({ where: { id } });
    });
  }

  async setStatus(id: string, dto: UpdateCampaignStatusDto) {
    await this.requireCampaign(id);
    const campaign = await this.prisma.campaign.update({
      where: { id },
      data: { status: dto.status },
      include: {
        channel: true,
        _count: { select: { completions: true } },
      },
    });
    const stats = await this.statsByCampaign([id]);
    return this.toAdminCampaign(campaign, stats.get(id) ?? EMPTY_STATS);
  }

  private async requireCampaign(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        channel: true,
        _count: { select: { completions: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  private campaignData(dto: CreateCampaignDto, channelId: string) {
    return {
      channelId,
      title: dto.title,
      shortDescription: dto.shortDescription,
      description: dto.description,
      type: dto.type,
      sponsorName: dto.sponsorName,
      rewardAmount: dto.rewardAmount,
      rewardCurrency: dto.rewardCurrency,
      holdHours: dto.holdHours,
      slotsTotal: dto.slotsTotal,
      referralTarget: dto.referralTarget,
      affiliateUrl: dto.affiliateUrl,
      requirements: dto.requirements as unknown as Prisma.InputJsonValue,
      rules: dto.rules,
      status: dto.status,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
    };
  }

  private upsertChannel(dto: CreateCampaignDto) {
    const username = dto.channelUsername.replace('@', '').trim();
    return this.prisma.channel.upsert({
      where: { username },
      update: {
        title: dto.channelTitle,
        memberCount: dto.channelMemberCount,
      },
      create: {
        username,
        title: dto.channelTitle,
        memberCount: dto.channelMemberCount,
      },
    });
  }

  private async upsertChannelFromPartial(dto: UpdateCampaignDto) {
    const username = (dto.channelUsername ?? '').replace('@', '').trim();
    if (!username) {
      throw new NotFoundException('Channel username is required');
    }
    return this.prisma.channel.upsert({
      where: { username },
      update: {
        ...(dto.channelTitle != null ? { title: dto.channelTitle } : {}),
        ...(dto.channelMemberCount != null ? { memberCount: dto.channelMemberCount } : {}),
      },
      create: {
        username,
        title: dto.channelTitle ?? username,
        memberCount: dto.channelMemberCount ?? 0,
      },
    });
  }

  private async statsByCampaign(ids: string[]) {
    const map = new Map<string, CampaignStats>();
    if (ids.length === 0) return map;

    const grouped = await this.prisma.completion.groupBy({
      by: ['campaignId', 'status'],
      where: { campaignId: { in: ids } },
      _count: { _all: true },
    });

    for (const id of ids) map.set(id, { ...EMPTY_STATS });

    for (const row of grouped) {
      const stats = map.get(row.campaignId) ?? { ...EMPTY_STATS };
      const count = row._count._all;
      stats.started += count;
      if (row.status === 'verified_pending') {
        stats.verified += count;
        stats.onHold += count;
      } else if (row.status === 'completed') {
        stats.verified += count;
        stats.completed += count;
      } else if (row.status === 'failed') {
        stats.failed += count;
      } else if (row.status === 'cancelled') {
        stats.cancelled += count;
      }
      map.set(row.campaignId, stats);
    }

    return map;
  }

  private toAdminCampaign(campaign: CampaignWithChannel, stats: CampaignStats) {
    const requirements = (campaign.requirements ?? {}) as RequirementsJson;
    return {
      id: campaign.id,
      title: campaign.title,
      shortDescription: campaign.shortDescription,
      description: campaign.description,
      type: campaign.type,
      channelUsername: campaign.channel.username,
      channelTitle: campaign.channel.title,
      channelMemberCount: campaign.channel.memberCount,
      sponsorName: campaign.sponsorName,
      rewardAmount: Number(campaign.rewardAmount),
      rewardCurrency: campaign.rewardCurrency,
      referralTarget: campaign.referralTarget ?? undefined,
      affiliateUrl: campaign.affiliateUrl ?? undefined,
      holdHours: campaign.holdHours,
      slotsTotal: campaign.slotsTotal,
      slotsRemaining: Math.max(0, campaign.slotsTotal - campaign._count.completions),
      requirements: {
        mustStaySubscribed: requirements.mustStaySubscribed ?? campaign.type !== 'affiliate',
        holdHours: requirements.holdHours ?? campaign.holdHours,
        newMembersOnly: requirements.newMembersOnly ?? false,
        minAccountAgeDays: requirements.minAccountAgeDays,
        maxCompletionsPerUser: requirements.maxCompletionsPerUser ?? 1,
      },
      rules: campaign.rules,
      status: campaign.status,
      startAt: campaign.startAt.toISOString(),
      endAt: campaign.endAt.toISOString(),
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      stats,
    };
  }

  private toEarnerTask(campaign: CampaignWithChannel) {
    const requirements = (campaign.requirements ?? {}) as RequirementsJson;
    const completed = campaign._count.completions;

    return {
      id: campaign.id,
      title: campaign.title,
      shortDescription: campaign.shortDescription,
      description: campaign.description,
      type: campaign.type,
      category: requirements.category ?? 'community',
      difficulty: requirements.difficulty ?? 'easy',
      channelUsername: campaign.channel.username,
      channelTitle: campaign.channel.title,
      channelMemberCount: campaign.channel.memberCount,
      channelDescription: requirements.channelDescription ?? '',
      sponsorName: campaign.sponsorName,
      rewardAmount: Number(campaign.rewardAmount),
      rewardCurrency: campaign.rewardCurrency,
      rewardLabel:
        requirements.rewardLabel ??
        (campaign.type === 'affiliate'
          ? 'Per qualified player'
          : campaign.type === 'referral'
            ? 'Milestone bonus'
            : 'Fixed payout'),
      referralTarget: campaign.referralTarget ?? undefined,
      affiliateUrl: campaign.affiliateUrl ?? undefined,
      holdHours: campaign.holdHours,
      estimatedMinutes: requirements.estimatedMinutes ?? 3,
      slotsTotal: campaign.slotsTotal,
      slotsRemaining: Math.max(0, campaign.slotsTotal - completed),
      requirements: {
        mustStaySubscribed: requirements.mustStaySubscribed ?? campaign.type !== 'affiliate',
        holdHours: requirements.holdHours ?? campaign.holdHours,
        newMembersOnly: requirements.newMembersOnly ?? false,
        minAccountAgeDays: requirements.minAccountAgeDays,
        maxCompletionsPerUser: requirements.maxCompletionsPerUser ?? 1,
      },
      rules: campaign.rules,
      tags: requirements.tags ?? [],
      startAt: campaign.startAt.toISOString(),
      endAt: campaign.endAt.toISOString(),
      status: campaign.status === 'draft' ? 'paused' : campaign.status,
    };
  }
}
