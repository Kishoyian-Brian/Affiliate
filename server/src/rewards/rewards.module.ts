import { Module } from '@nestjs/common';
import { RewardCalculationService } from './reward-calculation.service';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  controllers: [RewardsController],
  providers: [RewardsService, RewardCalculationService],
  exports: [RewardsService, RewardCalculationService],
})
export class RewardsModule {}
