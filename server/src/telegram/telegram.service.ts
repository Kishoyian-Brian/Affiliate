import { Injectable } from '@nestjs/common';
import { TelegramClient } from './telegram.client';
import { TelegramMembershipService } from './telegram-membership.service';

@Injectable()
export class TelegramService {
  constructor(
    private readonly client: TelegramClient,
    private readonly membership: TelegramMembershipService,
  ) {}

  isConfigured() {
    return this.client.isConfigured();
  }

  getChatMember(chatId: string | number, telegramUserId: bigint) {
    return this.membership.getChatMember(chatId, telegramUserId);
  }

  getChat(usernameOrId: string | number) {
    const chatId =
      typeof usernameOrId === 'string' && !usernameOrId.startsWith('@')
        ? `@${usernameOrId}`
        : usernameOrId;

    return this.client.call<{ id: number; title?: string; username?: string }>('getChat', {
      chat_id: chatId,
    });
  }
}
