import { Injectable } from '@nestjs/common';
import { ACCEPTED_MEMBERSHIP_STATUSES } from '../common/constants/membership-status';
import { TelegramClient } from './telegram.client';
import type { TelegramMember } from './types/telegram-member.type';

@Injectable()
export class TelegramMembershipService {
  constructor(private readonly client: TelegramClient) {}

  async getChatMember(chatId: string | number, telegramUserId: bigint): Promise<TelegramMember> {
    const result = await this.client.call<{ status: string }>('getChatMember', {
      chat_id: chatId,
      user_id: Number(telegramUserId),
    });

    return {
      status: result.status,
      isMember: ACCEPTED_MEMBERSHIP_STATUSES.includes(result.status as never),
    };
  }
}
