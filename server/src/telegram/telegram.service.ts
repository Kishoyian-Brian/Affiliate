import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ACCEPTED_MEMBER_STATUSES,
  type TelegramChatInfo,
  type TelegramChatMember,
} from './telegram.types';

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

interface RawChatMember {
  status: string;
  is_member?: boolean;
}

interface RawChat {
  id: number;
  title?: string;
  username?: string;
}

@Injectable()
export class TelegramService {
  constructor(private readonly config: ConfigService) {}

  isConfigured() {
    return Boolean(this.botToken);
  }

  async getChatMember(
    chatId: string | number,
    telegramUserId: bigint,
  ): Promise<TelegramChatMember> {
    const result = await this.call<RawChatMember>('getChatMember', {
      chat_id: chatId,
      user_id: Number(telegramUserId),
    });

    return {
      status: result.status,
      isMember: ACCEPTED_MEMBER_STATUSES.includes(
        result.status as (typeof ACCEPTED_MEMBER_STATUSES)[number],
      ),
    };
  }

  async getChat(usernameOrId: string | number): Promise<TelegramChatInfo> {
    const chatId =
      typeof usernameOrId === 'string' && !usernameOrId.startsWith('@')
        ? `@${usernameOrId}`
        : usernameOrId;

    const [chat, memberCount] = await Promise.all([
      this.call<RawChat>('getChat', { chat_id: chatId }),
      this.call<number>('getChatMemberCount', { chat_id: chatId }).catch(
        () => undefined,
      ),
    ]);

    return {
      id: BigInt(chat.id),
      title: chat.title ?? String(usernameOrId),
      username: chat.username,
      memberCount,
    };
  }

  private get botToken() {
    return this.config.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
  }

  private async call<T>(
    method: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    if (!this.botToken) {
      throw new ServiceUnavailableException(
        'TELEGRAM_BOT_TOKEN is not configured',
      );
    }

    const response = await fetch(
      `https://api.telegram.org/bot${this.botToken}/${method}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    const payload = (await response.json()) as TelegramApiResponse<T>;

    if (!payload.ok || payload.result === undefined) {
      throw new BadGatewayException(
        payload.description ?? `Telegram ${method} failed`,
      );
    }

    return payload.result;
  }
}
