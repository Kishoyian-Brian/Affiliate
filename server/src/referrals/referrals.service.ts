import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReferralAttributionService } from './referral-attribution.service';
import { RegisterReferralDto } from './dto/register-referral.dto';
import { ReferralFilterDto } from './dto/referral-filter.dto';

@Injectable()
export class ReferralsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attribution: ReferralAttributionService,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  findAll(filter: ReferralFilterDto) {
    return this.prisma.referral.findMany({
      where: { campaignId: filter.campaignId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async register(referredUserId: string, dto: RegisterReferralDto) {
    const referrerTelegramId = Number(dto.referrerId);
    if (!Number.isFinite(referrerTelegramId)) {
      throw new BadRequestException('Invalid referrer');
    }

    const referrer = await this.prisma.user.findUnique({
      where: { telegramId: BigInt(referrerTelegramId) },
    });
    if (!referrer) {
      throw new NotFoundException('Referrer not found');
    }
    if (referrer.id === referredUserId) {
      throw new BadRequestException('Self-referrals are not allowed');
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
    });
    if (!campaign || campaign.status !== 'active') {
      throw new NotFoundException('Campaign not found or not active');
    }

    const referral = await this.attribution.attribute(
      dto.campaignId,
      referrer.id,
      referredUserId,
    );

    const referred = await this.prisma.user.findUnique({ where: { id: referredUserId } });
    await this.notifications.create(referrer.id, {
      type: 'referral',
      title: 'New referral',
      body: `${referred?.displayName ?? 'Someone'} joined via your link for ${campaign.title}.`,
      href: `/app/tasks/${campaign.id}`,
    });

    return referral;
  }

  async progress(userId: string, campaignId: string) {
    if (!campaignId) throw new BadRequestException('campaignId is required');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const referrals = await this.prisma.referral.findMany({
      where: { campaignId, referrerId: userId },
    });

    const verifiedCount = referrals.filter((r) => r.status === 'verified').length;
    const pendingCount = referrals.filter((r) => r.status === 'attributed').length;
    const rejectedCount = referrals.filter((r) => r.status === 'invalid').length;

    const bot = (this.config.get<string>('telegramBotUsername') ?? 'tasklane_bot').replace(
      /^@/,
      '',
    );
    const referralLink = `https://t.me/${bot}?startapp=${encodeURIComponent(
      `task${campaignId}_ref${user.telegramId}`,
    )}`;

    return {
      taskId: campaignId,
      target: campaign.referralTarget ?? 0,
      verifiedCount,
      pendingCount,
      rejectedCount,
      referralLink,
    };
  }

  async history(userId: string, campaignId: string) {
    if (!campaignId) throw new BadRequestException('campaignId is required');

    const referrals = await this.prisma.referral.findMany({
      where: { campaignId, referrerId: userId },
      include: { referredUser: true },
      orderBy: { createdAt: 'desc' },
    });

    return referrals.map((item) => ({
      id: item.id,
      taskId: item.campaignId,
      referredDisplayName: item.referredUser.displayName,
      status:
        item.status === 'verified'
          ? 'verified'
          : item.status === 'invalid'
            ? 'rejected'
            : 'pending',
      createdAt: item.createdAt.toISOString(),
    }));
  }
}
