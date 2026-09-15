import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user.type';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly wallets: WalletsService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.wallets.getForUser(user.id);
  }

  @Post('connect')
  connect(@CurrentUser() user: AuthUser, @Body() dto: ConnectWalletDto) {
    return this.wallets.connect(user.id, dto);
  }
}
