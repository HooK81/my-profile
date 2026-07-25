/* eslint-disable @typescript-eslint/unbound-method */
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

import { HeadersService } from './headers.service';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
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
    expect(callHandler.handle).toHaveBeenCalled();
  });
});
