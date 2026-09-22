import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      activeCampaigns,
      verificationsToday,
      pendingWithdrawals,
      pendingHolds,
      totalVerifiedAllTime,
    ] = await Promise.all([
      this.prisma.campaign.count({ where: { status: 'active' } }),
      this.prisma.completion.count({ where: { verifiedAt: { gte: startOfDay } } }),
      this.prisma.withdrawal.count({ where: { status: 'pending' } }),
      this.prisma.completion.count({ where: { status: 'verified_pending' } }),
      this.prisma.completion.count({
        where: { status: { in: ['completed', 'verified_pending'] } },
      }),
    ]);

    return {
      activeCampaigns,
      verificationsToday,
      pendingWithdrawals,
      pendingHolds,
      totalVerifiedAllTime,
    };
  }
}
