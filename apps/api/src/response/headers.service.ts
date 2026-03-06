import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

export const APP_VERSION_HEADER = 'X-App-Version';

@Injectable()
export class HeadersService {
  constructor(private readonly configService: ConfigService) {}

  public setResponseHeaders(response: Response): void {
    response.setHeader(
      APP_VERSION_HEADER,
      `v${this.configService.get<string>('app_version')!}`,
    );
  }
}
