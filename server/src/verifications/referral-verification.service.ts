import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { VerificationResult } from './types/verification-result.type';

@Injectable()
export class ReferralVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async verify(referralId: string): Promise<VerificationResult> {
    const referral = await this.prisma.referral.findUnique({ where: { id: referralId } });
    if (!referral) {
      return { ok: false, status: 'missing', message: 'Referral not found' };
    }
    return { ok: referral.status === 'verified', status: referral.status, message: 'ok' };
  }
}
