import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import type { AuthUser } from '../common/types/auth-user.type';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';
import { ReviewWithdrawalDto } from './dto/review-withdrawal.dto';
import { WithdrawalFilterDto } from './dto/withdrawal-filter.dto';
import { WithdrawalsService } from './withdrawals.service';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawals: WithdrawalsService) {}

  @Post()
  request(@CurrentUser() user: AuthUser, @Body() dto: RequestWithdrawalDto) {
    return this.withdrawals.request(user.id, dto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll(@Query() filter: WithdrawalFilterDto) {
    return this.withdrawals.findAll(filter);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  review(@Param('id') id: string, @Body() dto: ReviewWithdrawalDto) {
    return this.withdrawals.review(id, dto);
  }
}
