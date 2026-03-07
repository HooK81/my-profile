import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { ApiError } from './ApiError';
import { AxiosApi } from './AxiosApi';
import { DeviceHashGenerator } from './DeviceHashGenerator';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
  },
}));

vi.mock('./DeviceHashGenerator');
vi.mock('i18next');
vi.mock('react-toastify');

class TestAxiosApi extends AxiosApi {
  public get(route: string, params?: object, config?: object) {
    return super.get(route, params, config);
  }

  public post(route: string, data: unknown, config?: object) {
    return super.post(route, data, config);
  }
}

type MockAxiosInstance = ReturnType<typeof vi.fn> & {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  interceptors: { response: { use: ReturnType<typeof vi.fn> } };
};

function makeAxiosError(
  status?: number,
  data?: unknown,
  headers?: Record<string, string>,
): AxiosError {
  const error = new Error('Request failed') as AxiosError;
  error.isAxiosError = true;
  if (status !== undefined) {
    error.response = { status, data, headers: headers ?? {} } as AxiosResponse;
  }
  error.config = {
    headers: { get: (key: string) => headers?.[key] },
  } as unknown as InternalAxiosRequestConfig;
  return error;
}
describe('AxiosApi', () => {
  let mockAxiosInstance: MockAxiosInstance;
  let successInterceptor: (res: AxiosResponse) => AxiosResponse;
  let errorInterceptor: (error: AxiosError) => Promise<AxiosResponse>;
  let testApi: TestAxiosApi;

  beforeEach(() => {
    mockAxiosInstance = Object.assign(vi.fn(), {
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn((s, e) => {
            successInterceptor = s;
            errorInterceptor = e;
          }),
        },
      },
    });

    vi.mocked(axios.create).mockReturnValue(
      mockAxiosInstance as unknown as AxiosInstance,
    );
    vi.mocked(DeviceHashGenerator.prototype.generateHash).mockResolvedValue(
      'mockedhash',
    );

    testApi = new TestAxiosApi();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('get()', () => {
    it('should return the axios response on success', async () => {
      const response = { data: { id: 1 } } as AxiosResponse;
      mockAxiosInstance.get.mockResolvedValue(response);

      const result = await testApi.get('/test', {});

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({ params: {} }),
      );
      expect(result).toBe(response);
    });

    it('should call toast.error and re-throw when showError is true (default)', async () => {
      const error = makeAxiosError(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: 'Internal error',
      });
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(testApi.get('/test')).rejects.toBe(error);

      expect(toast.error).toHaveBeenCalled();
    });

    it('should throw ApiError and not call toast when showError is false', async () => {
      const error = makeAxiosError(StatusCodes.UNPROCESSABLE_ENTITY, {
        field: 'email',
      });
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(
        testApi.get('/test', {}, { showError: false }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(toast.error).not.toHaveBeenCalled();
    });

    it.each([
      {
        scenario: 'with a response',
        error: makeAxiosError(StatusCodes.UNPROCESSABLE_ENTITY, {
          field: 'email',
        }),
        expectedStatus: StatusCodes.UNPROCESSABLE_ENTITY,
        expectedData: { field: 'email' },
      },
      {
        scenario: 'without a response (falls back to BAD_GATEWAY)',
        error: makeAxiosError(),
        expectedStatus: StatusCodes.BAD_GATEWAY,
        expectedData: undefined,
      },
    ])(
      'should throw ApiError with correct httpStatus and data ($scenario)',
      async ({ error, expectedStatus, expectedData }) => {
        mockAxiosInstance.get.mockRejectedValue(error);

        try {
          await testApi.get('/test', {}, { showError: false });
        } catch (e) {
          expect(e).toBeInstanceOf(ApiError);
          expect((e as ApiError).httpStatus).toBe(expectedStatus);
          expect((e as ApiError).data).toEqual(expectedData);
        }
      },
    );
  });

  describe('post()', () => {
    it('should return the axios response on success', async () => {
      const response = { data: null } as AxiosResponse;
      mockAxiosInstance.post.mockResolvedValue(response);

      const result = await testApi.post('/test', { key: 'value' });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test',
        { key: 'value' },
        expect.anything(),
      );
      expect(result).toBe(response);
    });

    it('should throw ApiError when showError is false', async () => {
      const error = makeAxiosError(StatusCodes.BAD_REQUEST, {
        message: 'Bad Request',
      });
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(
        testApi.post('/test', {}, { showError: false }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('ensureToken()', () => {
    it('should fetch a token when none is set', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { accessToken: 'my-token' },
      });

      await testApi.ensureToken();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/auth/token',
        expect.objectContaining({ params: {} }),
      );
    });

    it('should not fetch a token when one is already set', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { accessToken: 'my-token' },
      });
      await testApi.ensureToken();

      mockAxiosInstance.get.mockClear();
      await testApi.ensureToken();

      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });
  });

  describe('interceptor', () => {
    it('should pass through successful responses', () => {
      const response = { data: 'ok' } as AxiosResponse;
      expect(successInterceptor(response)).toBe(response);
    });

    it('should retry the request on 401 without x-no-retry header', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { accessToken: 'new-token' },
      });
      mockAxiosInstance.mockResolvedValue({ data: 'retried' });

      const retryError = makeAxiosError(StatusCodes.UNAUTHORIZED);
      const result = await errorInterceptor(retryError);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/auth/token',
        expect.anything(),
      );
      expect(mockAxiosInstance).toHaveBeenCalled();
      expect(result).toEqual({ data: 'retried' });
    });

    it('should reject with the original error on non-401 status', async () => {
      const error = makeAxiosError(StatusCodes.INTERNAL_SERVER_ERROR);

      await expect(errorInterceptor(error)).rejects.toBe(error);
    });

    it('should reject without retry if x-no-retry header is set', async () => {
      const error = makeAxiosError(StatusCodes.UNAUTHORIZED, undefined, {
        'x-no-retry': '1',
      });

      await expect(errorInterceptor(error)).rejects.toBe(error);
    });
  });
});
