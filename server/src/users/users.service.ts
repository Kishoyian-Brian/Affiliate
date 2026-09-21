import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { TelegramUser } from '../telegram/types/telegram-user.type';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const [completedTasks, activeReferrals, ledger] = await Promise.all([
      this.prisma.completion.count({ where: { userId: id, status: 'completed' } }),
      this.prisma.referral.count({ where: { referrerId: id, status: 'verified' } }),
      this.prisma.ledgerEntry.findMany({ where: { userId: id } }),
    ]);

    const held = sum(ledger.filter((e) => e.type === 'held').map((e) => Number(e.amount)));
    const released = sum(ledger.filter((e) => e.type === 'released').map((e) => Number(e.amount)));
    const revoked = sum(ledger.filter((e) => e.type === 'revoked').map((e) => Number(e.amount)));
    const reserved = sum(
      ledger.filter((e) => e.type === 'withdrawal_reserve').map((e) => Number(e.amount)),
    );
    const paid = sum(ledger.filter((e) => e.type === 'withdrawal_paid').map((e) => Number(e.amount)));
    const rejected = sum(
      ledger.filter((e) => e.type === 'withdrawal_rejected').map((e) => Number(e.amount)),
    );

    const availableBalance = round2(released - reserved - paid + rejected);
    const pendingBalance = round2(held - revoked);

    return {
      user: {
        id: user.id,
        telegramId: Number(user.telegramId),
        firstName: user.displayName.split(' ')[0] || user.displayName,
        lastName: user.displayName.split(' ').slice(1).join(' ') || undefined,
        username: user.username ?? undefined,
        balance: availableBalance,
        pendingBalance,
        currency: 'USD',
        completedTasks,
        activeReferrals,
        memberSince: user.createdAt.toISOString(),
        totalEarned: round2(released),
        accountStatus: user.status === 'restricted' ? 'restricted' : 'active',
        language: 'English',
        tonAddress: user.tonAddress ?? undefined,
        tonConnectedAt: user.tonConnectedAt?.toISOString(),
      },
      recentActivity: [],
    };
  }

  upsertFromTelegram(telegramUser: TelegramUser) {
    const displayName = [telegramUser.firstName, telegramUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    return this.prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      update: {
        username: telegramUser.username,
        displayName: displayName || telegramUser.username || String(telegramUser.id),
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username,
        displayName: displayName || telegramUser.username || String(telegramUser.id),
      },
    });
  }

  updateProfile(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  updateStatus(id: string, dto: UpdateUserStatusDto) {
    return this.prisma.user.update({ where: { id }, data: { status: dto.status } });
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
