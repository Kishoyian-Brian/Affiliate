import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TaskFilterDto } from './dto/task-filter.dto';
import { JoinTaskDto } from './dto/join-task.dto';
import { VerifyTaskDto } from './dto/verify-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filter: TaskFilterDto) {
    return this.prisma.completion.findMany({
      where: { status: filter.status as never },
      include: { campaign: true },
    });
  }

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

  verify(_userId: string, _dto: VerifyTaskDto) {
    return { ok: false, message: 'Verification service is not wired yet' };
  }
}
