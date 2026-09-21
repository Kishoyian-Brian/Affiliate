import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { ConnectTonWalletDto } from './dto/ton-proof.dto';
import { TonProofService } from './ton-proof.service';

const MIN_WITHDRAWAL = 5;
const WITHDRAWAL_FEE_PCT = 2;

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tonProof: TonProofService,
  ) {}

  async getForUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const [entries, withdrawals] = await Promise.all([
      this.prisma.ledgerEntry.findMany({ where: { userId } }),
      this.prisma.withdrawal.findMany({
        where: { userId },
        orderBy: { requestedAt: 'desc' },
        take: 50,
      }),
    ]);

    const held = sum(entries.filter((e) => e.type === 'held').map((e) => Number(e.amount)));
    const released = sum(entries.filter((e) => e.type === 'released').map((e) => Number(e.amount)));
    const revoked = sum(entries.filter((e) => e.type === 'revoked').map((e) => Number(e.amount)));
    const reserved = sum(
      entries.filter((e) => e.type === 'withdrawal_reserve').map((e) => Number(e.amount)),
    );
    const paid = sum(entries.filter((e) => e.type === 'withdrawal_paid').map((e) => Number(e.amount)));
    const rejected = sum(
      entries.filter((e) => e.type === 'withdrawal_rejected').map((e) => Number(e.amount)),
    );

    const availableBalance = round2(released - reserved - paid + rejected);
    const pendingBalance = round2(held - revoked);
    const lifetimeEarned = round2(released);
    const lifetimeWithdrawn = round2(paid);

    return {
      summary: {
        availableBalance,
        pendingBalance,
        lifetimeEarned,
        lifetimeWithdrawn,
        currency: 'USD',
        minWithdrawal: MIN_WITHDRAWAL,
        withdrawalFeePct: WITHDRAWAL_FEE_PCT,
      },
      connectedWallet: user.tonAddress
        ? {
            address: user.tonAddress,
            network: user.tonNetwork ?? '-239',
            walletApp: user.tonWalletApp ?? undefined,
            connectedAt: user.tonConnectedAt?.toISOString() ?? null,
          }
        : null,
      rewards: [],
      withdrawals: withdrawals.map((w) => ({
        id: w.id,
        amount: Number(w.amount),
        currency: w.currency,
        method: w.method,
        status: w.status === 'rejected' ? 'failed' : w.status,
        destination: w.destination,
        requestedAt: w.requestedAt.toISOString(),
        fee: Number(w.fee),
      })),
    };
  }

  createTonProofPayload(userId: string) {
    return this.tonProof.createPayload(userId);
  }

  connectTon(userId: string, dto: ConnectTonWalletDto) {
    return this.tonProof.verifyAndBind(userId, dto);
  }

  async disconnectTon(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tonAddress: null,
        tonNetwork: null,
        tonPublicKey: null,
        tonWalletApp: null,
        tonConnectedAt: null,
      },
    });
    return { ok: true };
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
