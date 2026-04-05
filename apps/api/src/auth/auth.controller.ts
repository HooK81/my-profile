import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthResponse } from 'my-profile-shared';

import { AuthService } from './auth.service';
import { COOKIE_NAME, COOKIE_OPTIONS, JWT_CONSTANTS } from './const';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  async getAnonymousToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const { accessToken } = await this.authService.anonymousSignin(req);

    res.cookie(COOKIE_NAME, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: JWT_CONSTANTS.EXPIRES_IN_MS,
    });

    return { authenticated: true };
  }
}
