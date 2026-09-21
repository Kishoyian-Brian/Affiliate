import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReferralAttributionService } from './referral-attribution.service';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './referrals.service';

@Module({
  imports: [NotificationsModule],
  controllers: [ReferralsController],
  providers: [ReferralsService, ReferralAttributionService],
  exports: [ReferralsService, ReferralAttributionService],
})
export class ReferralsModule {}
