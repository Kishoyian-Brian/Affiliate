import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hmacSha256, timingSafeEqualHex } from '../common/utils/crypto';
import type { TelegramUser } from './types/telegram-user.type';

@Injectable()
export class TelegramAuthService {
  constructor(private readonly config: ConfigService) {}

  async validateInitData(initData: string): Promise<TelegramUser> {
    const token =
      this.config.get<string>('telegramBotToken') ??
      this.config.get<string>('TELEGRAM_BOT_TOKEN') ??
      '';

    if (!token) {
      throw new UnauthorizedException('Telegram bot token is not configured');
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const userRaw = params.get('user');
    if (!hash || !userRaw) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }

    params.delete('hash');
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = hmacSha256('WebAppData', token);
    const digest = hmacSha256(secretKey, dataCheckString).toString('hex');

    if (!timingSafeEqualHex(digest, hash)) {
      throw new UnauthorizedException('Invalid Telegram initData signature');
    }

    const parsed = JSON.parse(userRaw) as {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };

    return {
      id: parsed.id,
      firstName: parsed.first_name,
      lastName: parsed.last_name,
      username: parsed.username,
    };
  }
}
