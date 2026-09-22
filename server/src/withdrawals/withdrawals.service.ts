import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';
import { ReviewWithdrawalDto } from './dto/review-withdrawal.dto';
import { WithdrawalFilterDto } from './dto/withdrawal-filter.dto';

const MIN_WITHDRAWAL = 5;
const FEE_PCT = 2;

@Injectable()
export class WithdrawalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async findAll(filter: WithdrawalFilterDto) {
    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { status: filter.status as never },
      include: { user: true },
      orderBy: { requestedAt: 'desc' },
    });

    return withdrawals.map((item) => ({
      id: item.id,
      userId: item.userId,
      telegramId: Number(item.user.telegramId),
      displayName: item.user.displayName,
      amount: Number(item.amount),
      currency: item.currency,
      method: item.method,
      destination: item.destination,
      status: item.status,
      requestedAt: item.requestedAt.toISOString(),
      fee: Number(item.fee),
    }));
  }

  async request(userId: string, dto: RequestWithdrawalDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.amount < MIN_WITHDRAWAL) {
      throw new BadRequestException(`Minimum withdrawal is $${MIN_WITHDRAWAL}`);
    }

    let destination = (dto.destination ?? '').trim();
    if (dto.method === 'ton') {
      if (!user.tonAddress) {
        throw new BadRequestException('Connect a TON wallet before withdrawing');
      }
      destination = user.tonAddress;
    } else if (!destination) {
      throw new BadRequestException('Enter a payout destination');
    }

    const entries = await this.prisma.ledgerEntry.findMany({ where: { userId } });
    const released = sum(entries.filter((e) => e.type === 'released').map((e) => Number(e.amount)));
    const reserved = sum(
      entries.filter((e) => e.type === 'withdrawal_reserve').map((e) => Number(e.amount)),
    );
    const paid = sum(entries.filter((e) => e.type === 'withdrawal_paid').map((e) => Number(e.amount)));
    const rejected = sum(
      entries.filter((e) => e.type === 'withdrawal_rejected').map((e) => Number(e.amount)),
    );
    const available = round2(released - reserved - paid + rejected);

    if (dto.amount > available) {
      throw new BadRequestException('Insufficient available balance');
    }

    const fee = round2((dto.amount * FEE_PCT) / 100);

    const withdrawal = await this.prisma.$transaction(async (tx) => {
      const created = await tx.withdrawal.create({
        data: {
          userId,
          amount: dto.amount,
          fee,
          currency: 'USD',
          method: dto.method,
          destination,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          userId,
          type: 'withdrawal_reserve',
          amount: dto.amount,
          currency: 'USD',
          withdrawalId: created.id,
        },
      });

      return created;
    });

    await this.notifications.create(userId, {
      type: 'withdrawal',
      title: 'Withdrawal requested',
      body: `$${dto.amount.toFixed(2)} via ${dto.method.toUpperCase()} is pending review.`,
      href: '/app/wallet',
    });

    return withdrawal;
  }

  async review(id: string, dto: ReviewWithdrawalDto) {
    const existing = await this.prisma.withdrawal.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Withdrawal not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.update({
        where: { id },
        data: { status: dto.status },
      });

      if (dto.status === 'completed') {
        await tx.ledgerEntry.upsert({
          where: { withdrawalId_type: { withdrawalId: id, type: 'withdrawal_paid' } },
          update: { amount: existing.amount },
          create: {
            userId: existing.userId,
            type: 'withdrawal_paid',
            amount: existing.amount,
            currency: existing.currency,
            withdrawalId: id,
          },
        });
      }

      if (dto.status === 'rejected') {
        await tx.ledgerEntry.upsert({
          where: { withdrawalId_type: { withdrawalId: id, type: 'withdrawal_rejected' } },
          update: { amount: existing.amount },
          create: {
            userId: existing.userId,
            type: 'withdrawal_rejected',
            amount: existing.amount,
            currency: existing.currency,
            withdrawalId: id,
          },
        });
      }

      return withdrawal;
    });

    const title =
      dto.status === 'completed'
        ? 'Withdrawal paid'
        : dto.status === 'rejected'
          ? 'Withdrawal rejected'
          : 'Withdrawal processing';
    const body =
      dto.status === 'completed'
        ? `$${Number(existing.amount).toFixed(2)} was sent to your payout destination.`
        : dto.status === 'rejected'
          ? `$${Number(existing.amount).toFixed(2)} was returned to your available balance.`
          : `$${Number(existing.amount).toFixed(2)} is being processed.`;

    await this.notifications.create(existing.userId, {
      type: 'withdrawal',
      title,
      body,
      href: '/app/wallet',
    });

    return updated;
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
