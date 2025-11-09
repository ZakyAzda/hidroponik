// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'INI_RAHASIA_JANGAN_DITIRU', // Pastikan SAMA PERSIS dengan di auth.module.ts
    });
  }

  async validate(payload: any) {
    console.log('DIAGNOSIS JWT STRATEGY: Payload dari token adalah:', payload);
    // Apapun yang di-return di sini akan "ditempelkan" ke req.user
    return { userId: payload.sub, email: payload.email };
  }
}