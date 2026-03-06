import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { DEFAULT_LOCALE, LocaleService } from './locale.service';

@Injectable({ scope: Scope.REQUEST })
export class LocaleInterceptor implements NestInterceptor {
  constructor(private readonly localeService: LocaleService) {}

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>();
    const locale = (request.params.locale as string) || DEFAULT_LOCALE;

    this.localeService.setLocale(locale);

    return next.handle() as Observable<T>;
  }
}
