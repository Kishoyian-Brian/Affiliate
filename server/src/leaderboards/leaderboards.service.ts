import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { LeaderboardEntry } from './types/leaderboard-entry.type';

@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<LeaderboardEntry[]> {
    const users = await this.prisma.user.findMany({ take: 50, orderBy: { createdAt: 'asc' } });
    return users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      displayName: user.displayName,
      totalEarned: '0',
      completedTasks: 0,
    }));
  }
}
