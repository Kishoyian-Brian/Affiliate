import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { LeaderboardEntry } from './types/leaderboard-entry.type';

@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(currentUserId?: string): Promise<LeaderboardEntry[]> {
    const released = await this.prisma.ledgerEntry.groupBy({
      by: ['userId'],
      where: { type: 'released' },
      _sum: { amount: true },
    });

    const completed = await this.prisma.completion.groupBy({
      by: ['userId'],
      where: { status: 'completed' },
      _count: { _all: true },
    });

    const earnedByUser = new Map(
      released.map((row) => [row.userId, Number(row._sum.amount ?? 0)]),
    );
    const completedByUser = new Map(
      completed.map((row) => [row.userId, row._count._all]),
    );

    const userIds = new Set([...earnedByUser.keys(), ...completedByUser.keys()]);
    if (userIds.size === 0) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });
    const userById = new Map(users.map((u) => [u.id, u]));

    const ranked = [...userIds]
      .map((userId) => {
        const user = userById.get(userId);
        if (!user) return null;
        return {
          userId,
          telegramId: Number(user.telegramId),
          displayName: user.displayName,
          username: user.username ?? undefined,
          totalEarned: earnedByUser.get(userId) ?? 0,
          completedTasks: completedByUser.get(userId) ?? 0,
          currency: 'USD',
        };
      })
      .filter((row): row is NonNullable<typeof row> => row != null)
      .sort((a, b) => b.totalEarned - a.totalEarned || b.completedTasks - a.completedTasks)
      .slice(0, 50)
      .map((row, index) => ({
        rank: index + 1,
        telegramId: row.telegramId,
        displayName: row.displayName,
        username: row.username,
        completedTasks: row.completedTasks,
        totalEarned: row.totalEarned,
        currency: row.currency,
        isCurrentUser: currentUserId ? row.userId === currentUserId : false,
      }));

    return ranked;
  }
}
