import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthResponse } from 'my-profile-shared';

import { AuthService } from './auth.service.js';
import { COOKIE_NAME, JWT_CONSTANTS } from './const.js';
import { accessCookieOptions } from './cookies.js';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  private readonly cookieSecure: boolean;

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    this.cookieSecure = configService.get<boolean>('cookie_secure')!;
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  async getAnonymousToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const { accessToken } = await this.authService.anonymousSignin(req);

    res.cookie(
      COOKIE_NAME,
      accessToken,
      accessCookieOptions(this.cookieSecure, JWT_CONSTANTS.EXPIRES_IN_MS),
    );

    return { authenticated: true };
  }
}
