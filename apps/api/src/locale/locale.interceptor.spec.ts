/* eslint-disable @typescript-eslint/unbound-method */
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { of } from 'rxjs';

import { LocaleInterceptor } from './locale.interceptor';
import { LocaleService } from './locale.service';

describe('LocaleInterceptor', () => {
  let interceptor: LocaleInterceptor;
  let localeService: LocaleService;

  beforeEach(() => {
    localeService = {
      setLocale: vi.fn(),
    } as unknown as LocaleService;

    interceptor = new LocaleInterceptor(localeService);
  });

  const createContext = (params: Record<string, string | undefined>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ params }),
      }),
    }) as unknown as ExecutionContext;

  const createCallHandler = (): CallHandler => ({
    handle: vi.fn(() => of('test-response')),
  });

  it.each([
    { params: { locale: 'fr' }, expectedLocale: 'fr' },
    { params: {}, expectedLocale: 'en' },
  ])('should set locale from request', ({ params, expectedLocale }) => {
    const callHandler = createCallHandler();

    interceptor.intercept(createContext(params), callHandler);

    expect(localeService.setLocale).toHaveBeenCalledWith(expectedLocale);
    expect(callHandler.handle).toHaveBeenCalled();
  });

  it.each(['de', '../etc/passwd', 'EN', 'xyz'])(
    'should throw BadRequestException for unsupported locale "%s"',
    (locale) => {
      expect(() =>
        interceptor.intercept(createContext({ locale }), createCallHandler()),
      ).toThrow(BadRequestException);
    },
  );
});
