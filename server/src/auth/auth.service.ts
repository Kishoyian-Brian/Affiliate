import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/constants/roles';
import { TelegramAuthService } from '../telegram/telegram-auth.service';
import { UsersService } from '../users/users.service';
import { TelegramLoginDto } from './dto/telegram-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly telegramAuth: TelegramAuthService,
    private readonly users: UsersService,
  ) {}

  async telegramLogin(dto: TelegramLoginDto) {
    const telegramUser = await this.telegramAuth.validateInitData(dto.initData);
    const user = await this.users.upsertFromTelegram(telegramUser);
    return this.sign(user.id, Role.User, String(telegramUser.id));
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        role: Role;
        telegramId?: string;
        email?: string;
      }>(dto.refreshToken);
      return this.sign(payload.sub, payload.role, payload.telegramId, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private sign(id: string, role: Role, telegramId?: string, email?: string) {
    const payload = { sub: id, role, telegramId, email };
    return {
      accessToken: this.jwt.sign(payload),
      refreshToken: this.jwt.sign(payload, { expiresIn: 60 * 60 * 24 * 30 }),
    };
  }
}
