import { Global, Module } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramClient } from './telegram.client';
import { TelegramMembershipService } from './telegram-membership.service';
import { TelegramService } from './telegram.service';

@Global()
@Module({
  providers: [TelegramClient, TelegramService, TelegramMembershipService, TelegramAuthService],
  exports: [TelegramClient, TelegramService, TelegramMembershipService, TelegramAuthService],
})
export class TelegramModule {}
