import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { TelegramLoginDto } from './dto/telegram-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('telegram')
  telegramLogin(@Body() dto: TelegramLoginDto) {
    return this.auth.telegramLogin(dto);
  }

  @Public()
  @Post('admin')
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.auth.adminLogin(dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto);
  }
}
