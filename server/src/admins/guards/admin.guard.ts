import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../../common/constants/roles';
import type { AuthUser } from '../../common/types/auth-user.type';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<{ user?: AuthUser }>().user;
    if (!user || user.role !== Role.Admin) {
      throw new ForbiddenException('Admin only');
    }
    return true;
  }
}
