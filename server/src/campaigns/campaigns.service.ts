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

  create(_dto: CreateCampaignDto) {
    return Promise.reject(new Error('Campaign create is not wired yet'));
  }

  update(id: string, dto: UpdateCampaignDto) {
    return this.prisma.campaign.update({ where: { id }, data: dto as never });
  }

  setStatus(id: string, dto: UpdateCampaignStatusDto) {
    return this.prisma.campaign.update({ where: { id }, data: { status: dto.status } });
  }

  private toEarnerTask(
    campaign: Prisma.CampaignGetPayload<{
      include: { channel: true; _count: { select: { completions: true } } };
    }>,
  ) {
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
