import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    const entries = await this.prisma.ledgerEntry.findMany({ where: { userId } });
    const held = sum(entries.filter((e) => e.type === 'held').map((e) => Number(e.amount)));
    const released = sum(entries.filter((e) => e.type === 'released').map((e) => Number(e.amount)));
    const revoked = sum(entries.filter((e) => e.type === 'revoked').map((e) => Number(e.amount)));
    const reserved = sum(entries.filter((e) => e.type === 'withdrawal_reserve').map((e) => Number(e.amount)));
    const paid = sum(entries.filter((e) => e.type === 'withdrawal_paid').map((e) => Number(e.amount)));
    const rejected = sum(entries.filter((e) => e.type === 'withdrawal_rejected').map((e) => Number(e.amount)));

    return {
      available: (released - reserved - paid + rejected).toFixed(2),
      pending: (held - revoked).toFixed(2),
      currency: 'USD',
    };
  }

  connect(_userId: string, _dto: ConnectWalletDto) {
    return { ok: true };
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}
