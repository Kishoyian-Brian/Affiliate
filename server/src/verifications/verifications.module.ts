import { Module } from '@nestjs/common';
import { MembershipVerificationService } from './membership-verification.service';
import { ReferralVerificationService } from './referral-verification.service';
import { VerificationsService } from './verifications.service';

@Module({
  providers: [VerificationsService, MembershipVerificationService, ReferralVerificationService],
  exports: [VerificationsService, MembershipVerificationService, ReferralVerificationService],
})
export class VerificationsModule {}
