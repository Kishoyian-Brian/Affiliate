import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import type { AuthUser } from '../common/types/auth-user.type';
import { ReferralFilterDto } from './dto/referral-filter.dto';
import { RegisterReferralDto } from './dto/register-referral.dto';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referrals: ReferralsService) {}

  @Post()
  register(@CurrentUser() user: AuthUser, @Body() dto: RegisterReferralDto) {
    return this.referrals.register(user.id, dto);
  }

  @Get('progress')
  progress(
    @CurrentUser() user: AuthUser,
    @Query('campaignId') campaignId: string,
  ) {
    return this.referrals.progress(user.id, campaignId);
  }

  @Get('history')
  history(
    @CurrentUser() user: AuthUser,
    @Query('campaignId') campaignId: string,
  ) {
    return this.referrals.history(user.id, campaignId);
  }

  @Roles(Role.Admin)
  @Get()
  findAll(@Query() filter: ReferralFilterDto) {
    return this.referrals.findAll(filter);
  }
}
