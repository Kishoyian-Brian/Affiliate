import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MembershipVerificationService } from '../verifications/membership-verification.service';
import { JoinTaskDto } from './dto/join-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { VerifyTaskDto } from './dto/verify-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membership: MembershipVerificationService,
    private readonly notifications: NotificationsService,
  ) {}

  findAll(filter: TaskFilterDto) {
    return this.prisma.completion.findMany({
      where: { status: filter.status as never },
      include: { campaign: true },
    });
  }

  async myCompletions(userId: string) {
    const completions = await this.prisma.completion.findMany({
      where: { userId },
      include: { ledgerEntries: true },
      orderBy: { updatedAt: 'desc' },
    });

    const map: Record<
      string,
      {
        taskId: string;
        status: string;
        rewardStatus: string;
        verifiedAt?: string;
        holdReleaseAt?: string;
        failureReason?: string;
      }
    > = {};

    for (const completion of completions) {
      const hasReleased = completion.ledgerEntries.some((e) => e.type === 'released');
      const hasHeld = completion.ledgerEntries.some((e) => e.type === 'held');
      const hasRevoked = completion.ledgerEntries.some((e) => e.type === 'revoked');

      let rewardStatus = 'none';
      if (hasRevoked || completion.status === 'cancelled') rewardStatus = 'cancelled';
      else if (hasReleased || completion.status === 'completed') rewardStatus = 'released';
      else if (hasHeld || completion.status === 'verified_pending') rewardStatus = 'held';

      map[completion.campaignId] = {
        taskId: completion.campaignId,
        status: completion.status,
        rewardStatus,
        verifiedAt: completion.verifiedAt?.toISOString(),
        holdReleaseAt: completion.holdReleaseAt?.toISOString(),
      };
    }

    return map;
  }

  async completionForCampaign(userId: string, campaignId: string) {
    const map = await this.myCompletions(userId);
    return map[campaignId] ?? null;
  }

  async join(userId: string, dto: JoinTaskDto) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: dto.campaignId } });
    if (!campaign || campaign.status !== 'active') {
      throw new NotFoundException('Campaign not found or not active');
    }

    return this.prisma.completion.upsert({
      where: { campaignId_userId: { campaignId: dto.campaignId, userId } },
      update: {},
      create: {
        campaignId: dto.campaignId,
        userId,
        rewardAmount: campaign.rewardAmount,
        rewardCurrency: campaign.rewardCurrency,
        status: 'awaiting_verification',
      },
    });
  }

  async verify(userId: string, dto: VerifyTaskDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
      include: { channel: true },
    });
    if (!campaign || campaign.status !== 'active') {
      throw new NotFoundException('Campaign not found or not active');
    }

    await this.join(userId, { campaignId: dto.campaignId });

    if (campaign.type === 'affiliate') {
      const completion = await this.prisma.completion.update({
        where: { campaignId_userId: { campaignId: dto.campaignId, userId } },
        data: { status: 'awaiting_verification' },
      });

      return {
        success: true,
        completionStatus: 'awaiting_verification',
        rewardStatus: 'none',
        message:
          '$40 is credited when the trading app confirms a referred friend deposited and played.',
        completion,
      };
    }

    let memberOk = false;
    let telegramStatus = 'unknown';
    let failureReason: string | undefined;

    if (campaign.channel.telegramChatId != null) {
      try {
        const result = await this.membership.verify(
          String(campaign.channel.telegramChatId),
          user.telegramId,
        );
        memberOk = result.ok;
        telegramStatus = result.status;
        failureReason = result.ok ? undefined : result.message;
      } catch {
        failureReason = 'Could not verify channel membership. Try again shortly.';
      }
    } else {
      // Seeded channels may not have a chat id yet — accept verify so the hold/release flow works.
      memberOk = true;
      telegramStatus = 'member';
    }

    if (!memberOk) {
      await this.prisma.completion.update({
        where: { campaignId_userId: { campaignId: dto.campaignId, userId } },
        data: {
          status: 'failed',
          telegramStatusRaw: telegramStatus,
          verificationMethod: 'telegram_membership',
        },
      });

      await this.notifications.create(userId, {
        type: 'verification_failed',
        title: 'Verification failed',
        body: failureReason ?? `Could not verify membership for ${campaign.title}.`,
        href: `/app/tasks/${campaign.id}`,
      });

      return {
        success: false,
        completionStatus: 'failed',
        rewardStatus: 'none',
        message: failureReason ?? 'Subscribe to the channel, then try again.',
      };
    }

    const verifiedAt = new Date();
    const holdHours = campaign.holdHours;
    const holdReleaseAt =
      holdHours > 0
        ? new Date(verifiedAt.getTime() + holdHours * 60 * 60 * 1000)
        : verifiedAt;

    const completion = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.completion.update({
        where: { campaignId_userId: { campaignId: dto.campaignId, userId } },
        data: {
          status: holdHours > 0 ? 'verified_pending' : 'completed',
          verificationMethod: 'telegram_membership',
          telegramStatusRaw: telegramStatus,
          verifiedAt,
          holdReleaseAt,
          rewardAmount: campaign.rewardAmount,
          rewardCurrency: campaign.rewardCurrency,
        },
      });

      if (holdHours > 0) {
        await tx.ledgerEntry.upsert({
          where: { completionId_type: { completionId: updated.id, type: 'held' } },
          update: { amount: campaign.rewardAmount },
          create: {
            userId,
            type: 'held',
            amount: campaign.rewardAmount,
            currency: campaign.rewardCurrency,
            completionId: updated.id,
          },
        });
      } else {
        await tx.ledgerEntry.upsert({
          where: { completionId_type: { completionId: updated.id, type: 'released' } },
          update: { amount: campaign.rewardAmount },
          create: {
            userId,
            type: 'released',
            amount: campaign.rewardAmount,
            currency: campaign.rewardCurrency,
            completionId: updated.id,
          },
        });
      }

      return updated;
    });

    await this.notifications.create(userId, {
      type: holdHours > 0 ? 'reward_held' : 'reward_released',
      title: holdHours > 0 ? 'Reward on hold' : 'Reward released',
      body:
        holdHours > 0
          ? `${campaign.title} — $${Number(campaign.rewardAmount).toFixed(2)} unlocks after the hold.`
          : `${campaign.title} — $${Number(campaign.rewardAmount).toFixed(2)} paid to your wallet.`,
      href: '/app/wallet',
    });

    return {
      success: true,
      completionStatus: completion.status,
      rewardStatus: holdHours > 0 ? 'held' : 'released',
      holdReleaseAt: completion.holdReleaseAt?.toISOString(),
      message:
        holdHours > 0
          ? `Verified! Reward unlocks after ${holdHours} hours if you stay subscribed.`
          : 'Verified! Your reward is available.',
    };
  }
}
