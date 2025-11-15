// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) { // Inject ConfigService
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')!, // Ambil dari .env dengan jaminan non-null
    });
  }

  async validate(payload: any) {
    // Apapun yang di-return di sini akan "ditempelkan" ke req.user
    return { 
      userId: payload.sub, 
      email: payload.email, 
      name: payload.name, 
      role: payload.role 
    };
  }
}