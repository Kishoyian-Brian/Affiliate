import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsService } from './notifications.service';
import { TelegramNotificationService } from './telegram-notification.service';

@Module({
  providers: [NotificationsService, EmailService, TelegramNotificationService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
