import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  RawAxiosRequestHeaders,
  ResponseType,
} from 'axios';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { t } from 'i18next';
import { toast } from 'react-toastify';

import { ApiError } from './ApiError';

const NO_RETRY_HEADER = 'x-no-retry';

type ApiConfig = {
  showError: boolean;
  errorAutoClose: number;
  headers: RawAxiosRequestHeaders;
  responseType: ResponseType;
  apiName: string;
};

export class AxiosApi {
  private axios: AxiosInstance;
  private authenticated: boolean;
  protected baseURL: string;

  constructor() {
    this.authenticated = false;
    this.baseURL = import.meta.env.VITE_API_URL;

    this.axios = axios.create({
      timeout: 30000,
      baseURL: this.baseURL,
      withCredentials: true,
    });

    this.setInterceptors();
  }

  private setInterceptors() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    this.axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        if (
          error.response?.status === StatusCodes.UNAUTHORIZED &&
          originalRequest &&
          !originalRequest.headers?.get(NO_RETRY_HEADER)
        ) {
          self.authenticated = false;
          await self.refreshToken();
          return self.axios({
            ...originalRequest,
            headers: {
              ...self.getHeaders(),
              [NO_RETRY_HEADER]: '1',
            },
          });
        }
        return Promise.reject(error);
      },
    );
  }

  protected async get(
    route: string,
    params: object = {},
    config: Partial<ApiConfig> = {},
  ): Promise<AxiosResponse> {
    const apiConfig: ApiConfig = {
      showError: true,
      errorAutoClose: 5000,
      headers: {},
      responseType: 'json',
      apiName: 'default',
      ...config,
    };

    try {
      return await this.axios.get(route, {
        params,
        responseType: apiConfig.responseType,
        headers: { ...this.getHeaders(), ...apiConfig.headers },
      });
    } catch (error) {
      this.handleApiError(error as AxiosError, route, apiConfig);
      throw error;
    }
  }

  protected async post(
    route: string,
    data: unknown,
    config: Partial<ApiConfig> = {},
  ): Promise<AxiosResponse> {
    const apiConfig: ApiConfig = {
      showError: true,
      errorAutoClose: 5000,
      headers: {},
      responseType: 'json',
      apiName: 'default',
      ...config,
    };

    try {
      return await this.axios.post(route, data, {
        headers: { ...this.getHeaders(), ...apiConfig.headers },
      });
    } catch (error) {
      this.handleApiError(error as AxiosError, route, apiConfig);
      throw error;
    }
  }

  public async ensureAuth(): Promise<void> {
    if (!this.authenticated) {
      await this.refreshToken();
    }
  }

  private async refreshToken(): Promise<void> {
    await this.get(
      '/v1/auth/token',
      {},
      {
        showError: false,
        headers: { [NO_RETRY_HEADER]: '1' },
        apiName: 'login',
      },
    );
    this.authenticated = true;
  }

  private getHeaders(): RawAxiosRequestHeaders {
    return {};
  }

  private handleApiError(
    error: AxiosError,
    route: string,
    config: ApiConfig,
  ): void {
    const message = `API Error ${config.apiName} [${route}]: ${error.message}`;
    console.error(message, error);

    if (config.showError) {
      const toastMessage = t(`error.api.${config.apiName}`);
      toast.error(`${toastMessage} ${t('error.api.tryAgain')}`, {
        autoClose: config.errorAutoClose,
      });

      return;
    }

    throw new ApiError(
      message,
      error.response?.status ?? StatusCodes.BAD_GATEWAY,
      error.response?.data,
    );
  }
}
