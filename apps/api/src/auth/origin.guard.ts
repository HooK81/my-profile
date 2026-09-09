import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF defence in depth on top of SameSite=Strict: every mutating request,
 * public routes included, must carry an Origin equal to PUBLIC_APP_URL's.
 * No double-submit token: a cross-site attacker can neither read nor set a
 * cookie on our origin, so it would add nothing.
 */
@Injectable()
export class OriginGuard implements CanActivate {
  private readonly allowedOrigin: string;

  constructor(configService: ConfigService) {
    this.allowedOrigin = configService.get<string>('public_origin')!;
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.has(req.method)) {
      return true;
    }
    const { origin } = req.headers;
    if (!origin || origin !== this.allowedOrigin) {
      throw new ForbiddenException();
    }
    return true;
  }
}
