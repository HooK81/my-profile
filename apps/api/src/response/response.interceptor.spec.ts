/* eslint-disable @typescript-eslint/unbound-method */
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { HeadersService } from './headers.service';
import { ResponseInterceptor } from './response.interceptor';

describe('LocaleInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let headerService: HeadersService;

  beforeEach(() => {
    headerService = {
      setResponseHeaders: vi.fn(),
    } as unknown as HeadersService;

    interceptor = new ResponseInterceptor(headerService);
  });

  it('should set header to response', () => {
    const responseMock = new Response();
    const getResponseMock = vi.fn().mockReturnValue(responseMock);
    const context = {
      switchToHttp: () => ({
        getResponse: getResponseMock,
      }),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = {
      handle: vi.fn(() => of('test-response')),
    };

    interceptor.intercept(context, callHandler);

    expect(headerService.setResponseHeaders).toHaveBeenCalledExactlyOnceWith(
      responseMock,
    );
  });

  it('should next.handle() have been called and return an Observable', () => {
    const context = {
      switchToHttp: () => ({
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = {
      handle: vi.fn(() => of('default-header-response')),
    };

    const result = interceptor.intercept(context, callHandler);

    expect(callHandler.handle).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Observable);
  });
});
