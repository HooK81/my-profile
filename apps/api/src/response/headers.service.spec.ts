import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { APP_VERSION_HEADER, HeadersService } from './headers.service';

const APP_VERSION = '1.2.3';

describe('HeadersService', () => {
  let service: HeadersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeadersService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string): string => {
              const map: Record<string, string> = {
                app_version: APP_VERSION,
              };
              return map[key];
            }),
          },
        },
      ],
    }).compile();

    service = await module.resolve<HeadersService>(HeadersService);
  });

  it('should set header to response', () => {
    const setHeaderMock = vi.fn();
    const response = {
      setHeader: setHeaderMock,
    } as unknown as Response;

    service.setResponseHeaders(response);

    expect(setHeaderMock).toHaveBeenCalledWith(
      APP_VERSION_HEADER,
      `v${APP_VERSION}`,
    );
  });
});
