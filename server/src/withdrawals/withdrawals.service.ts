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

  findAll(filter: WithdrawalFilterDto) {
    return this.prisma.withdrawal.findMany({
      where: { status: filter.status as never },
      orderBy: { requestedAt: 'desc' },
    });
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

  review(id: string, dto: ReviewWithdrawalDto) {
    return this.prisma.withdrawal.update({ where: { id }, data: { status: dto.status } });
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
