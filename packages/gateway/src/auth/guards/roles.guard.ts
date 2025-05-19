import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../constants/user-role.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const hasRole = this.matchRoles(requiredRoles, user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `${requiredRoles.join(', ')} 권한이 필요합니다.`,
      );
    }

    return true;
  }

  private matchRoles(requiredRoles: UserRole[], userRole: UserRole): boolean {
    return requiredRoles.some((role) => role === userRole);
  }
}
