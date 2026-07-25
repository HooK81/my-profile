import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { ApiError } from './ApiError';
import { FetchApi } from './FetchApi';

const BASE_URL = vi.hoisted(() => {
  const url = 'https://api.test';
  vi.stubEnv('VITE_API_URL', url);
  return url;
});

vi.mock('i18next');
vi.mock('react-toastify');

class TestFetchApi extends FetchApi {
  public get<T>(route: string, params?: object, config?: object) {
    return super.get<T>(route, params, config);
  }

  public post<T>(route: string, data: unknown, config?: object) {
    return super.post<T>(route, data, config);
  }
}

function jsonResponse(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
  });
}

describe('FetchApi', () => {
  const fetchMock = vi.fn<typeof fetch>();
  let testApi: TestFetchApi;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    testApi = new TestFetchApi();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  describe('get()', () => {
    it('should fetch the route with credentials and return the parsed body', async () => {
      fetchMock.mockResolvedValue(jsonResponse(StatusCodes.OK, { id: 1 }));

      const result = await testApi.get('/test');

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/test`,
        expect.objectContaining({ method: 'GET', credentials: 'include' }),
      );
      expect(result).toEqual({ id: 1 });
    });

    it('should append params as a query string', async () => {
      fetchMock.mockResolvedValue(jsonResponse(StatusCodes.OK, {}));

      await testApi.get('/test', { page: 2, search: 'foo' });

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/test?page=2&search=foo`,
        expect.anything(),
      );
    });

    it('should return a Blob when responseType is blob', async () => {
      fetchMock.mockResolvedValue(
        new Response('pdf content', { status: StatusCodes.OK }),
      );

      const result = await testApi.get('/test', {}, { responseType: 'blob' });

      expect(result).toBeInstanceOf(Blob);
    });

    it('should call toast.error and reject when showError is true (default)', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, {
          message: 'Internal error',
        }),
      );

      await expect(testApi.get('/test')).rejects.toBeInstanceOf(ApiError);

      expect(toast.error).toHaveBeenCalled();
    });

    it('should reject with ApiError and not call toast when showError is false', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(StatusCodes.UNPROCESSABLE_ENTITY, { field: 'email' }),
      );

      await expect(
        testApi.get('/test', {}, { showError: false }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(toast.error).not.toHaveBeenCalled();
    });

    it.each([
      {
        scenario: 'with an error response',
        setup: () =>
          fetchMock.mockResolvedValue(
            jsonResponse(StatusCodes.UNPROCESSABLE_ENTITY, { field: 'email' }),
          ),
        expectedStatus: StatusCodes.UNPROCESSABLE_ENTITY,
        expectedData: { field: 'email' },
      },
      {
        scenario: 'without a response (falls back to BAD_GATEWAY)',
        setup: () => fetchMock.mockRejectedValue(new TypeError('fetch failed')),
        expectedStatus: StatusCodes.BAD_GATEWAY,
        expectedData: undefined,
      },
    ])(
      'should reject with correct httpStatus and data ($scenario)',
      async ({ setup, expectedStatus, expectedData }) => {
        setup();

        try {
          await testApi.get('/test', {}, { showError: false });
          expect.unreachable();
        } catch (e) {
          expect(e).toBeInstanceOf(ApiError);
          expect((e as ApiError).httpStatus).toBe(expectedStatus);
          expect((e as ApiError).data).toEqual(expectedData);
        }
      },
    );
  });

  describe('post()', () => {
    it('should send the data as a JSON body and return the parsed response', async () => {
      fetchMock.mockResolvedValue(jsonResponse(StatusCodes.CREATED, { id: 1 }));

      const result = await testApi.post('/test', { key: 'value' });

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ key: 'value' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }) as unknown,
        }),
      );
      expect(result).toEqual({ id: 1 });
    });

    it('should resolve when the response body is empty', async () => {
      fetchMock.mockResolvedValue(jsonResponse(StatusCodes.NO_CONTENT));

      await expect(testApi.post('/test', { key: 'value' })).resolves.toBe(
        undefined,
      );
    });

    it('should reject with ApiError when showError is false', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(StatusCodes.BAD_REQUEST, { message: 'Bad Request' }),
      );

      await expect(
        testApi.post('/test', {}, { showError: false }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('ensureAuth()', () => {
    it('should authenticate when not yet authenticated', async () => {
      fetchMock.mockResolvedValue(jsonResponse(StatusCodes.OK, {}));

      await testApi.ensureAuth();

      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE_URL}/v1/auth/token`,
        expect.anything(),
      );
    });

    it('should not re-authenticate when already authenticated', async () => {
      fetchMock.mockResolvedValue(jsonResponse(StatusCodes.OK, {}));
      await testApi.ensureAuth();

      fetchMock.mockClear();
      await testApi.ensureAuth();

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('401 retry', () => {
    it('should refresh the token and retry the request once on 401', async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(StatusCodes.UNAUTHORIZED))
        .mockResolvedValueOnce(jsonResponse(StatusCodes.OK, {}))
        .mockResolvedValueOnce(jsonResponse(StatusCodes.OK, { id: 1 }));

      const result = await testApi.get('/test');

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        `${BASE_URL}/v1/auth/token`,
        expect.anything(),
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        `${BASE_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({ 'x-no-retry': '1' }) as unknown,
        }),
      );
      expect(result).toEqual({ id: 1 });
    });

    it('should not retry when the x-no-retry header is set', async () => {
      fetchMock.mockResolvedValue(jsonResponse(StatusCodes.UNAUTHORIZED));

      await expect(
        testApi.get(
          '/test',
          {},
          { showError: false, headers: { 'x-no-retry': '1' } },
        ),
      ).rejects.toBeInstanceOf(ApiError);

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should not retry more than once when the retry still returns 401', async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(StatusCodes.UNAUTHORIZED))
        .mockResolvedValueOnce(jsonResponse(StatusCodes.OK, {}))
        .mockResolvedValueOnce(jsonResponse(StatusCodes.UNAUTHORIZED));

      await expect(
        testApi.get('/test', {}, { showError: false }),
      ).rejects.toBeInstanceOf(ApiError);

      expect(fetchMock).toHaveBeenCalledTimes(3);
    });
  });
});
