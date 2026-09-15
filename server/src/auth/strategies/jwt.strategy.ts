import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../../common/constants/roles';
import type { AuthUser } from '../../common/types/auth-user.type';

interface JwtPayload {
  sub: string;
  role: Role;
  telegramId?: string;
  email?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret') ?? 'change-me',
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      id: payload.sub,
      role: payload.role,
      telegramId: payload.telegramId,
      email: payload.email,
    };
  }
}
