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
import { accessTokenSchema } from 'my-profile-shared';
import { toast } from 'react-toastify';

import { ApiError } from './ApiError';
import { DeviceHashGenerator } from './DeviceHashGenerator';

const NO_RETRY_HEADER = 'x-no-retry';

type ApiConfig = {
  showError: boolean;
  errorAutoClose: number;
  headers: RawAxiosRequestHeaders;
  responseType: ResponseType;
  apiName: string;
};

export class AxiosApi {
  private deviceHashGenerator: DeviceHashGenerator;
  private axios: AxiosInstance;
  private token: string | null;
  protected baseURL: string;

  constructor() {
    this.deviceHashGenerator = new DeviceHashGenerator();
    this.token = null;
    this.baseURL = import.meta.env.VITE_API_URL;

    this.axios = axios.create({
      timeout: 30000,
      baseURL: this.baseURL,
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
          await self.refreshToken();
          return self.axios({
            ...originalRequest,
            headers: {
              ...(await self.getHeaders()),
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
        headers: { ...(await this.getHeaders()), ...apiConfig.headers },
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
        headers: { ...(await this.getHeaders()), ...apiConfig.headers },
      });
    } catch (error) {
      this.handleApiError(error as AxiosError, route, apiConfig);
      throw error;
    }
  }

  public async ensureToken(): Promise<void> {
    if (!this.token) {
      await this.refreshToken();
    }
  }

  private async refreshToken(): Promise<void> {
    const res = await this.get(
      '/v1/auth/token',
      {},
      {
        showError: false,
        headers: { [NO_RETRY_HEADER]: '1' },
        apiName: 'login',
      },
    );
    const parsedResponse = accessTokenSchema.parse(res.data);
    this.token = `Bearer ${parsedResponse.accessToken}`;
  }

  private async getHeaders(): Promise<RawAxiosRequestHeaders> {
    return {
      'x-device-hash': await this.deviceHashGenerator.generateHash(),
      ...(this.token ? { Authorization: this.token } : {}),
    };
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
