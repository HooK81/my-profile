import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

import { HeadersService } from './headers.service.js';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly headerService: HeadersService) {}

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<T> {
    const response = context.switchToHttp().getResponse<Response>();

    this.headerService.setResponseHeaders(response);

    return next.handle() as Observable<T>;
  }
}
