import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from './email.service';
import { TelegramNotificationService } from './telegram-notification.service';

export type CreateNotificationInput = {
  type:
    | 'reward_held'
    | 'reward_released'
    | 'verification_failed'
    | 'withdrawal'
    | 'referral'
    | 'system';
  title: string;
  body: string;
  href?: string;
};

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly telegram: TelegramNotificationService,
  ) {}

  create(userId: string, input: CreateNotificationInput) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: input.type,
        title: input.title,
        body: input.body,
        href: input.href,
      },
    });
  }

  async listForUser(userId: string) {
    const items = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      body: item.body,
      createdAt: item.createdAt.toISOString(),
      read: item.read,
      href: item.href ?? undefined,
    }));
  }

  async markRead(userId: string, id: string) {
    const existing = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  notifyUser(telegramId: string, message: string) {
    return this.telegram.send(telegramId, message);
  }

  notifyEmail(to: string, subject: string, body: string) {
    return this.email.send(to, subject, body);
  }
}
