import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Request } from 'express';
import { AccessToken, accessTokenSchema } from 'my-profile-shared';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async anonymousSignin(deviceHash: string): Promise<AccessToken> {
    const payload = {
      role: 'anonymous',
      deviceHash,
      iat: Math.floor(Date.now() / 1000),
    };

    return accessTokenSchema.parse({
      accessToken: await this.jwtService.signAsync(payload),
    });
  }

  public checkDeviceHash(req: Request): string {
    const deviceHash = req.headers['x-device-hash'] || '';
    const userAgent = req.headers['user-agent'] || '';

    const expected = this.hashDevice(userAgent);

    if (deviceHash !== expected) {
      throw new UnauthorizedException();
    }

    return deviceHash;
  }

  public hashDevice(userAgent: string): string {
    return crypto.createHash('sha256').update(userAgent).digest('hex');
  }
}
