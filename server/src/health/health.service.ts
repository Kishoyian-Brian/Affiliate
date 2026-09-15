import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        db: 'down',
        telegram: this.telegram.isConfigured() ? 'configured' : 'missing_token',
      });
    }

    return {
      status: 'ok',
      db: 'up',
      telegram: this.telegram.isConfigured() ? 'configured' : 'missing_token',
    };
  }
}
