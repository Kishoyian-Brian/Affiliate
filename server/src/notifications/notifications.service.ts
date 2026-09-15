import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { TelegramNotificationService } from './telegram-notification.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly email: EmailService,
    private readonly telegram: TelegramNotificationService,
  ) {}

  notifyUser(telegramId: string, message: string) {
    return this.telegram.send(telegramId, message);
  }

  notifyEmail(to: string, subject: string, body: string) {
    return this.email.send(to, subject, body);
  }
}
