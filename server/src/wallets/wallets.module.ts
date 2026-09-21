import { Module } from '@nestjs/common';
import { TonProofService } from './ton-proof.service';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, TonProofService],
  exports: [WalletsService],
})
export class WalletsModule {}
