// src/auth/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client'; // Impor enum dari Prisma

// Ekspor enum-nya agar bisa dipakai di tempat lain
export { UserRole }; 

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);