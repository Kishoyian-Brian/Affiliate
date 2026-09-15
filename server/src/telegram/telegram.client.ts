import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

@Injectable()
export class TelegramClient {
  constructor(private readonly config: ConfigService) {}

  isConfigured() {
    return Boolean(this.token);
  }

  async call<T>(method: string, body: Record<string, unknown>): Promise<T> {
    if (!this.token) {
      throw new ServiceUnavailableException('TELEGRAM_BOT_TOKEN is not configured');
    }

    const response = await fetch(`https://api.telegram.org/bot${this.token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as TelegramApiResponse<T>;
    if (!payload.ok || payload.result === undefined) {
      throw new BadGatewayException(payload.description ?? `Telegram ${method} failed`);
    }
    return payload.result;
  }

  private get token() {
    return this.config.get<string>('telegramBotToken') ?? this.config.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
  }
}
