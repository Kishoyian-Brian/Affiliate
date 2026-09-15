import { Injectable } from '@nestjs/common';
import { MembershipVerificationService } from './membership-verification.service';
import { ReferralVerificationService } from './referral-verification.service';

@Injectable()
export class VerificationsService {
  constructor(
    private readonly membership: MembershipVerificationService,
    private readonly referrals: ReferralVerificationService,
  ) {}

  verifyMembership(chatId: string, telegramUserId: bigint) {
    return this.membership.verify(chatId, telegramUserId);
  }

  verifyReferral(referralId: string) {
    return this.referrals.verify(referralId);
  }
}
