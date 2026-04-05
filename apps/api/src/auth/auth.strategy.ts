import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { COOKIE_NAME } from './const';
import { JwtToken } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.[COOKIE_NAME] as string,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret')!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtToken) {
    this.authService.verifyFingerprint(req, payload.deviceFingerprint);

    return payload;
  }
}
