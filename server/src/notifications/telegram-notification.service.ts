import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelegramNotificationService {
  private readonly logger = new Logger(TelegramNotificationService.name);

  send(telegramId: string, message: string) {
    this.logger.log(`Telegram notify skipped (${telegramId}): ${message}`);
    return Promise.resolve({ telegramId, message, sent: false });
  }
}
