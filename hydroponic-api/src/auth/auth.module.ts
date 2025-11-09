// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- 1. Impor
import { JwtStrategy } from './jwt.strategy';     // <-- 2. Impor
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule, // <-- 3. Tambahkan di sini
    JwtModule.register({
      secret: 'INI_RAHASIA_JANGAN_DITIRU', // Secret key Anda
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- 4. Tambahkan JwtStrategy di sini
})
export class AuthModule {}