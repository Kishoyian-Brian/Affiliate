import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReferralAttributionService {
  constructor(private readonly prisma: PrismaService) {}

  attribute(campaignId: string, referrerId: string, referredUserId: string) {
    return this.prisma.referral.upsert({
      where: { campaignId_referredUserId: { campaignId, referredUserId } },
      update: {},
      create: { campaignId, referrerId, referredUserId },
    });
  }
}
