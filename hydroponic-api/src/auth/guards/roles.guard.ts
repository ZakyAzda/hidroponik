// src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Dapatkan role apa yang "diperlukan" dari decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Jika tidak ada decorator @Roles(), izinkan saja (atau tolak, tergantung kebutuhan)
    if (!requiredRoles) {
      return true;
    }

    // 2. Dapatkan data user dari request (ini hasil dari JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 3. Bandingkan role user dengan role yang diperlukan
    return requiredRoles.some((role) => user.role === role);
  }
}