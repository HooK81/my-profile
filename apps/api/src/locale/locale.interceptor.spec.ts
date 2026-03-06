/* eslint-disable @typescript-eslint/unbound-method */
import { CallHandler, ExecutionContext } from '@nestjs/common';
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

  it.each([{ params: { locale: 'fr' } }, { params: {} }])(
    'should set locale from request',
    ({ params }) => {
      const expectedLocale = params.locale ?? DEFAULT_LOCALE;
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            params,
          }),
        }),
      } as unknown as ExecutionContext;

      const callHandler: CallHandler = {
        handle: vi.fn(() => of('test-response')),
      };

      interceptor.intercept(context, callHandler);

      expect(localeService.setLocale).toHaveBeenCalledWith(expectedLocale);
    },
  );

  it('should next.handle() have been called and return an Observable', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { locale: 'fr' },
        }),
      }),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = {
      handle: vi.fn(() => of('default-locale-response')),
    };

    const result = interceptor.intercept(context, callHandler);

    expect(callHandler.handle).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Observable);
  });
});
