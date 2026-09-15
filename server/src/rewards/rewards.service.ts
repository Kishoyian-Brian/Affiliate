import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ApproveRewardDto } from './dto/approve-reward.dto';
import { RejectRewardDto } from './dto/reject-reward.dto';
import { RewardCalculationService } from './reward-calculation.service';

@Injectable()
export class RewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculation: RewardCalculationService,
  ) {}

  findAll() {
    return this.prisma.ledgerEntry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }

  approve(dto: ApproveRewardDto) {
    return this.prisma.completion.update({
      where: { id: dto.completionId },
      data: { status: 'completed' },
    });
  }

  reject(dto: RejectRewardDto) {
    return this.prisma.completion.update({
      where: { id: dto.completionId },
      data: { status: 'cancelled' },
    });
  }
}
