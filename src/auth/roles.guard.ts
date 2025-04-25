import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  levels = {
    ADMIN: 3,
    MANAGER: 2,
    MEMBER: 1,
  };

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    const userAccess = this.levels[user.role];

    const requiredAccess = this.levels[requiredRoles as string];

    if (userAccess < requiredAccess) {
      throw new ForbiddenException(
        `Role '${user.role}' not authorized for this request`,
      );
    }

    return true;
  }
}
