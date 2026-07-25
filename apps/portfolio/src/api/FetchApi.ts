import { StatusCodes } from 'http-status-codes';
import { t } from 'i18next';
import { toast } from 'react-toastify';

import { ApiError } from './ApiError';

const NO_RETRY_HEADER = 'x-no-retry';
const TIMEOUT_MS = 30000;

type ApiConfig = {
  showError: boolean;
  errorAutoClose: number;
  headers: Record<string, string>;
  responseType: 'json' | 'blob';
  apiName: string;
};

const DEFAULT_CONFIG: ApiConfig = {
  showError: true,
  errorAutoClose: 5000,
  headers: {},
  responseType: 'json',
  apiName: 'default',
};

export class FetchApi {
  private authenticated = false;
  private refreshPromise: Promise<void> | null = null;
  protected baseURL: string = import.meta.env.VITE_API_URL;

  public async ensureAuth(): Promise<void> {
    if (!this.authenticated) {
      await this.refreshToken();
    }
  }

  protected async get<T>(
    route: string,
    params: object = {},
    config: Partial<ApiConfig> = {},
  ): Promise<T> {
    return this.request<T>('GET', route, params, undefined, {
      ...DEFAULT_CONFIG,
      ...config,
    });
  }

  protected async post<T>(
    route: string,
    data: unknown,
    config: Partial<ApiConfig> = {},
  ): Promise<T> {
    return this.request<T>('POST', route, {}, data, {
      ...DEFAULT_CONFIG,
      ...config,
    });
  }

  private async request<T>(
    method: string,
    route: string,
    params: object,
    data: unknown,
    config: ApiConfig,
  ): Promise<T> {
    try {
      return await this.doFetch<T>(method, route, params, data, config);
    } catch (error) {
      this.handleApiError(error as Error, route, config);
      throw error;
    }
  }

  private async doFetch<T>(
    method: string,
    route: string,
    params: object,
    data: unknown,
    config: ApiConfig,
    isRetry = false,
  ): Promise<T> {
    const response = await this.fetchResponse(
      method,
      route,
      params,
      data,
      config,
    );

    if (
      response.status === StatusCodes.UNAUTHORIZED &&
      !isRetry &&
      !config.headers[NO_RETRY_HEADER]
    ) {
      this.authenticated = false;
      await this.refreshToken();
      return this.doFetch<T>(
        method,
        route,
        params,
        data,
        { ...config, headers: { ...config.headers, [NO_RETRY_HEADER]: '1' } },
        true,
      );
    }

    if (!response.ok) {
      throw new ApiError(
        `Request failed with status code ${response.status}`,
        response.status,
        await this.parseBody(response),
      );
    }

    if (config.responseType === 'blob') {
      return (await response.blob()) as T;
    }

    return (await this.parseBody(response)) as T;
  }

  private async fetchResponse(
    method: string,
    route: string,
    params: object,
    data: unknown,
    config: ApiConfig,
  ): Promise<Response> {
    try {
      return await fetch(this.buildUrl(route, params), {
        method,
        credentials: 'include',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          ...(data !== undefined && { 'Content-Type': 'application/json' }),
          ...config.headers,
        },
        body: data !== undefined ? JSON.stringify(data) : undefined,
      });
    } catch (error) {
      throw new ApiError(
        (error as Error).message,
        StatusCodes.BAD_GATEWAY,
        undefined,
      );
    }
  }

  private buildUrl(route: string, params: object): string {
    const query = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();

    return `${this.baseURL}${route}${query ? `?${query}` : ''}`;
  }

  // Some endpoints answer 201/204 with an empty body: response.json() would throw
  private async parseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) {
      return undefined;
    }
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // Single-flight: concurrent 401s share one refresh call
  private refreshToken(): Promise<void> {
    this.refreshPromise ??= this.get(
      '/v1/auth/token',
      {},
      {
        showError: false,
        headers: { [NO_RETRY_HEADER]: '1' },
        apiName: 'login',
      },
    )
      .then(() => {
        this.authenticated = true;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  private handleApiError(error: Error, route: string, config: ApiConfig): void {
    console.error(
      `API Error ${config.apiName} [${route}]: ${error.message}`,
      error,
    );

    if (config.showError) {
      const toastMessage = t(`error.api.${config.apiName}`);
      toast.error(`${toastMessage} ${t('error.api.tryAgain')}`, {
        autoClose: config.errorAutoClose,
      });
    }
  }
}
