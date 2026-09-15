import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';
import { ReviewWithdrawalDto } from './dto/review-withdrawal.dto';
import { WithdrawalFilterDto } from './dto/withdrawal-filter.dto';

@Injectable()
export class WithdrawalsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filter: WithdrawalFilterDto) {
    return this.prisma.withdrawal.findMany({
      where: { status: filter.status as never },
      orderBy: { requestedAt: 'desc' },
    });
  }

  request(userId: string, dto: RequestWithdrawalDto) {
    return this.prisma.withdrawal.create({
      data: {
        userId,
        amount: dto.amount,
        fee: 0,
        currency: 'USD',
        method: dto.method,
        destination: dto.destination,
      },
    });
  }

  review(id: string, dto: ReviewWithdrawalDto) {
    return this.prisma.withdrawal.update({ where: { id }, data: { status: dto.status } });
  }
}
