import { Injectable } from '@nestjs/common';
import { TelegramMembershipService } from '../telegram/telegram-membership.service';
import type { VerificationResult } from './types/verification-result.type';

@Injectable()
export class MembershipVerificationService {
  constructor(private readonly membership: TelegramMembershipService) {}

  async verify(chatId: string, telegramUserId: bigint): Promise<VerificationResult> {
    const member = await this.membership.getChatMember(chatId, telegramUserId);
    return {
      ok: member.isMember,
      status: member.status,
      message: member.isMember ? 'Membership confirmed' : 'Not a channel member',
    };
  }
}
