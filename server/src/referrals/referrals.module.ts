import { Module } from '@nestjs/common';
import { ReferralAttributionService } from './referral-attribution.service';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './referrals.service';

@Module({
  controllers: [ReferralsController],
  providers: [ReferralsService, ReferralAttributionService],
  exports: [ReferralsService, ReferralAttributionService],
})
export class ReferralsModule {}
