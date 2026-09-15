import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TelegramAuthService } from '../../telegram/telegram-auth.service';
import type { Request } from 'express';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor(private readonly telegramAuth: TelegramAuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const initData =
      (request.headers['x-telegram-init-data'] as string | undefined) ??
      (typeof request.body === 'object' && request.body
        ? (request.body as { initData?: string }).initData
        : undefined);

    if (!initData) {
      throw new UnauthorizedException('Missing Telegram initData');
    }

    request.user = await this.telegramAuth.validateInitData(initData);
    return true;
  }
}
