import { Injectable } from '@nestjs/common';
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
