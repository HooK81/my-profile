import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Request } from 'express';
import { AccessToken, accessTokenSchema } from 'my-profile-shared';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async anonymousSignin(
    deviceFingerprint: string,
  ): Promise<AccessToken> {
    const payload = {
      role: 'anonymous',
      deviceFingerprint,
      iat: Math.floor(Date.now() / 1000),
    };

    return accessTokenSchema.parse({
      accessToken: await this.jwtService.signAsync(payload),
    });
  }

  public computeFingerprint(req: Request): string {
    const userAgent = (req.headers['user-agent'] as string) || '';
    const acceptLanguage = (req.headers['accept-language'] as string) || '';
    const acceptEncoding = (req.headers['accept-encoding'] as string) || '';

    const data = [userAgent, acceptLanguage, acceptEncoding].join('\0');
    const secret = this.configService.get<string>('deviceFingerprint.secret')!;

    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  public verifyFingerprint(req: Request, expectedFingerprint: string): void {
    const computed = this.computeFingerprint(req);

    const isValid =
      computed.length === expectedFingerprint.length &&
      crypto.timingSafeEqual(
        Buffer.from(computed, 'hex'),
        Buffer.from(expectedFingerprint, 'hex'),
      );

    if (!isValid) {
      const userAgent = (req.headers['user-agent'] as string) || '';
      this.logger.warn(
        'Device fingerprint mismatch - possible auth bypass attempt',
        {
          ip: req.ip,
          userAgent: userAgent.slice(0, 200),
        },
      );
      throw new UnauthorizedException();
    }
  }
}
