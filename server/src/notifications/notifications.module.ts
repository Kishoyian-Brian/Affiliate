import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TelegramNotificationService } from './telegram-notification.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, TelegramNotificationService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
