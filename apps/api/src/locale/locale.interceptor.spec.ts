/* eslint-disable @typescript-eslint/unbound-method */
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { LocaleInterceptor } from './locale.interceptor';
import { DEFAULT_LOCALE, LocaleService } from './locale.service';

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

  it.each([{ params: { locale: 'fr' } }, { params: {} }])(
    'should set locale from request',
    ({ params }) => {
      const expectedLocale = params.locale ?? DEFAULT_LOCALE;

      interceptor.intercept(createContext(params), createCallHandler());

      expect(localeService.setLocale).toHaveBeenCalledWith(expectedLocale);
    },
  );

  it('should next.handle() have been called and return an Observable', () => {
    const callHandler = createCallHandler();

    const result = interceptor.intercept(
      createContext({ locale: 'fr' }),
      callHandler,
    );

    expect(callHandler.handle).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Observable);
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
