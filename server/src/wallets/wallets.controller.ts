import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user.type';
import { ConnectTonWalletDto } from './dto/ton-proof.dto';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly wallets: WalletsService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.wallets.getForUser(user.id);
  }

  @Post('ton-proof/payload')
  createTonProofPayload(@CurrentUser() user: AuthUser) {
    return this.wallets.createTonProofPayload(user.id);
  }

  @Post('connect/ton')
  connectTon(@CurrentUser() user: AuthUser, @Body() dto: ConnectTonWalletDto) {
    return this.wallets.connectTon(user.id, dto);
  }

  @Delete('connect/ton')
  disconnectTon(@CurrentUser() user: AuthUser) {
    return this.wallets.disconnectTon(user.id);
  }
}
