import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccessToken } from 'my-profile-shared';

import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  async getAnonymousToken(@Req() req: Request): Promise<AccessToken> {
    const deviceHash = this.authService.checkDeviceHash(req);

    return await this.authService.anonymousSignin(deviceHash);
  }
}
