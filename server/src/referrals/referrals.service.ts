import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReferralAttributionService } from './referral-attribution.service';
import { RegisterReferralDto } from './dto/register-referral.dto';
import { ReferralFilterDto } from './dto/referral-filter.dto';

@Injectable()
export class ReferralsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attribution: ReferralAttributionService,
  ) {}

  findAll(filter: ReferralFilterDto) {
    return this.prisma.referral.findMany({
      where: { campaignId: filter.campaignId },
      orderBy: { createdAt: 'desc' },
    });
  }

  register(referredUserId: string, dto: RegisterReferralDto) {
    return this.attribution.attribute(dto.campaignId, dto.referrerId, referredUserId);
  }
}
