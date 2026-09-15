import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JoinTaskDto } from './dto/join-task.dto';
import { LeaveTaskDto } from './dto/leave-task.dto';

@Injectable()
export class ParticipationService {
  constructor(private readonly prisma: PrismaService) {}

  join(userId: string, dto: JoinTaskDto) {
    return this.prisma.completion.upsert({
      where: { campaignId_userId: { campaignId: dto.campaignId, userId } },
      update: {},
      create: {
        campaignId: dto.campaignId,
        userId,
        rewardAmount: 0,
        rewardCurrency: 'USD',
      },
    });
  }

  leave(userId: string, dto: LeaveTaskDto) {
    return this.prisma.completion.update({
      where: { campaignId_userId: { campaignId: dto.campaignId, userId } },
      data: { status: 'cancelled' },
    });
  }
}
