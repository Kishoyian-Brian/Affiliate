import { Global, Module } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramClient } from './telegram.client';
import { TelegramController } from './telegram.controller';
import { TelegramMembershipService } from './telegram-membership.service';
import { TelegramService } from './telegram.service';

@Global()
@Module({
  controllers: [TelegramController],
  providers: [
    TelegramClient,
    TelegramService,
    TelegramMembershipService,
    TelegramAuthService,
    TelegramBotService,
  ],
  exports: [TelegramClient, TelegramService, TelegramMembershipService, TelegramAuthService],
})
export class TelegramModule {}
