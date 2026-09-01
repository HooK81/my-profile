import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { APP_VERSION_HEADER, HeadersService } from './headers.service.js';

const APP_VERSION = '1.2.3';

const createModule = async (appEnv: string): Promise<TestingModule> =>
  Test.createTestingModule({
    providers: [
      HeadersService,
      {
        provide: ConfigService,
        useValue: {
          get: vi.fn((key: string): string => {
            const map: Record<string, string> = {
              app_version: APP_VERSION,
              app_env: appEnv,
            };
            return map[key];
          }),
        },
      },
    ],
  }).compile();

describe('HeadersService', () => {
  it('should set header in non-production environment', async () => {
    const module = await createModule('development');
    const service = await module.resolve<HeadersService>(HeadersService);
    const setHeaderMock = vi.fn();
    const response = { setHeader: setHeaderMock } as unknown as Response;

    service.setResponseHeaders(response);

    expect(setHeaderMock).toHaveBeenCalledWith(
      APP_VERSION_HEADER,
      `v${APP_VERSION}`,
    );
  });

  it('should not set header in production environment', async () => {
    const module = await createModule('production');
    const service = await module.resolve<HeadersService>(HeadersService);
    const setHeaderMock = vi.fn();
    const response = { setHeader: setHeaderMock } as unknown as Response;

    service.setResponseHeaders(response);

    expect(setHeaderMock).not.toHaveBeenCalled();
  });
});
