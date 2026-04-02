import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { COOKIE_NAME } from './const';

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

  validate<T>(req: Request, payload: T) {
    this.authService.checkDeviceHash(req);

    return payload;
  }
}
