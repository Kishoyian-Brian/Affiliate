import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TelegramClient } from '../telegram/telegram.client';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramClient,
  ) {}

  async findAll() {
    const channels = await this.prisma.channel.findMany({
      include: { _count: { select: { campaigns: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return channels.map((channel) => ({
      id: channel.id,
      username: channel.username,
      title: channel.title,
      memberCount: channel.memberCount,
      botAccess: channel.botAccess,
      lastCheckedAt: channel.lastCheckedAt?.toISOString(),
      campaignCount: channel._count.campaigns,
    }));
  }

  create(dto: CreateChannelDto) {
    return this.prisma.channel.create({
      data: { username: dto.username.replace('@', ''), title: dto.title },
    });
  }

  update(id: string, dto: UpdateChannelDto) {
    return this.prisma.channel.update({ where: { id }, data: dto });
  }

  async testBot(username: string) {
    const handle = username.replace('@', '').trim();
    const channel = await this.prisma.channel.findUnique({ where: { username: handle } });
    if (!channel) {
      return { ok: false, message: 'Channel not in registry. Add it when creating a campaign.' };
    }

    try {
      const chat = await this.telegram.call<{ id: number }>('getChat', { chat_id: `@${handle}` });
      const me = await this.telegram.call<{ id: number }>('getMe');
      const member = await this.telegram.call<{ status: string }>('getChatMember', {
        chat_id: chat.id,
        user_id: me.id,
      });
      const ok = member.status === 'administrator' || member.status === 'creator';

      let memberCount = channel.memberCount;
      try {
        memberCount = await this.telegram.call<number>('getChatMemberCount', { chat_id: chat.id });
      } catch {
        /* ignore */
      }

      await this.prisma.channel.update({
        where: { id: channel.id },
        data: {
          telegramChatId: BigInt(chat.id),
          botAccess: ok ? 'ok' : 'failed',
          lastCheckedAt: new Date(),
          memberCount,
        },
      });

      return {
        ok,
        message: ok
          ? 'Bot can verify membership on this channel.'
          : 'Bot is not admin on this channel or lacks membership read access.',
      };
    } catch (error) {
      await this.prisma.channel.update({
        where: { id: channel.id },
        data: { botAccess: 'failed', lastCheckedAt: new Date() },
      });

      const message = error instanceof Error ? error.message : 'Could not reach Telegram.';
      return { ok: false, message };
    }
  }
}
