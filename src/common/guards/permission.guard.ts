import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const userPermissions = context.getArgs()[0].user.role.permissions;
    const role = context.getArgs()[0].user.role;

    if (role.slug == 'super-admin') return true;
    if (!routePermissions) {
      return true;
    }

    let i = 0;
    let allowPermission = false;
    for (i; i < userPermissions.length; i++) {
      if (routePermissions == userPermissions[i].name) {
        allowPermission = true;
      }
    }
    return allowPermission;
  }
}
