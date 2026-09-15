import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import { ApproveRewardDto } from './dto/approve-reward.dto';
import { RejectRewardDto } from './dto/reject-reward.dto';
import { RewardsService } from './rewards.service';

@Controller('rewards')
@Roles(Role.Admin)
export class RewardsController {
  constructor(private readonly rewards: RewardsService) {}

  @Get()
  findAll() {
    return this.rewards.findAll();
  }

  @Post('approve')
  approve(@Body() dto: ApproveRewardDto) {
    return this.rewards.approve(dto);
  }

  @Post('reject')
  reject(@Body() dto: RejectRewardDto) {
    return this.rewards.reject(dto);
  }
}
