import axios from 'axios';
import uuidv4 from 'uuid/v4';
import { PasswordEncoder } from './passwordEncoder';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import { routing } from './routing/index';
import { defaults } from 'lodash';

export const HTTP_OK = 200;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_MULTIPLE_CHOICES = 300;
export const HTTP_INTERNAL_SERVER_ERROR = 500;

/**
 * Api error base class
 */
export class ApiError extends Error {
  constructor(message, httpStatus = null, data = null) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    this.data = data;
  }
}

/**
 * Api base class
 * Used to inject token into requests
 */
export class Api {
  constructor(props) {
    this.props = props;

    this.passwordEncoder = new PasswordEncoder();
    this.setHasToken(false);
    this.axios = axios.create({
      timeout: 30000,
    });

    this.setInterceptors();
  }

  /**
   * Axios Interceptors for injecting API Token
   */
  /* istanbul ignore next */
  setInterceptors() {
    const that = this;

    /* Refresh token when API return 401 error */
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === HTTP_UNAUTHORIZED &&
          !originalRequest._retry
        ) {
          that.setHasToken(false);
          originalRequest._retry = true;
          return that.refreshToken().then((res) => {
            if (res.status >= HTTP_OK && res.status < HTTP_MULTIPLE_CHOICES) {
              // Relaunch original request with new token
              return that.axios(originalRequest);
            }
          });
        }
        return Promise.reject(error);
      },
    );
  }

  handleApiError(error, routeName, axiosConfig, _bla) {
    // error
    const { showError, errorAutoClose } = axiosConfig;

    const errorMEssage = this.buildApiErrorMessage(routeName, error.message);
    if (showError) {
      toast.error(`${errorMEssage}\n${i18n.t('api.error.please_try_later')}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: errorAutoClose,
      });
    }
    if (error.constructor.name === 'ApiError') {
      throw error;
    }
    throw new ApiError(
      errorMEssage,
      error.response.status,
      error.response.data,
    );
  }

  /**
   * GET
   * @param {string} Name
   * @param {object} routeParameters
   * @param {AxiosRequestConfig} config
   */
  async get(routeName, routeParameters = {}, config = {}) {
    config = defaults(config, { showError: true, errorAutoClose: true });
    try {
      const url = this.buildUrl(routeName, routeParameters);
      return await this.axios.get(url, config).catch((error) => {
        this.handleApiError(error, routeName, config);
      });
    } catch (e) {
      console.error('API GET', routeName, e.message);
      throw e;
    }
  }

  /**
   * POST
   * @param {string} url
   * @param {any} data post content
   * @param {object} routeParameters
   * @param {AxiosRequestConfig} config
   */
  async post(routeName, data = null, routeParameters = {}, config = {}) {
    config = defaults(config, { showError: true, errorAutoClose: true });
    try {
      const url = this.buildUrl(routeName, routeParameters);

      return await this.axios.post(url, data, config).catch((error) => {
        this.handleApiError(error, routeName, config);
      });
    } catch (e) {
      console.error('API POST', routeName, e.message);
      throw e;
    }
  }

  /**
   * Get or Refresh an access token to API
   * @returns Promise
   */
  refreshToken() {
    if (this.props) {
      return this.props.onGetToken();
    }
  }

  /**
   * Set Token Cookie flag
   * @param {*} tokenCookieIsPresent
   */
  setHasToken(tokenCookieIsPresent) {
    this.hasToken = tokenCookieIsPresent;
  }

  /**
   * Is Token cookie present ?
   * @returns bool
   */
  getHasToken() {
    return this.hasToken;
  }

  /**
   * Get credentials for get token request
   */
  getCredentials() {
    const username = uuidv4();
    const key = this.passwordEncoder.generateKey(username);
    const password = this.passwordEncoder.encodePassword(username, key);

    return {
      username: username,
      password: password,
      key: key,
    };
  }

  /**
   * Build URL from name and parameters
   * If parameters is null, assume routeName is a full qualified URL
   * @param {string} routeName
   * @param {object} routeParameters
   * @throws         Error if routeName does not exists
   */
  buildUrl(routeName, routeParameters = {}, absolute = false) {
    if (routeParameters !== null) {
      return routing.generate(routeName, routeParameters, absolute);
    }
    return routing.generate(routeName, {}, absolute);
  }

  /**
   * Build error message
   * @param {string} routeName
   * @param {string} errorMessage
   */
  buildApiErrorMessage(routeName, errorMessage) {
    const key = `api.error.${routeName}`;
    if (i18n.exists(key)) {
      return i18n.t(key, { msg: errorMessage });
    }
    return errorMessage;
  }

  /**
   * Build form error object
   * @param {Array.<Object>} errors from API
   * @param {object} fields name mapping
   */
  buildFormErrors(errors, fieldsMapping = {}) {
    if (typeof errors !== 'object') {
      return {};
    }

    return errors.reduce((backErrors, error) => {
      // Each error can contains multiple fields
      const newError = Object.keys(error).reduce((newError, field) => {
        const fieldName =
          typeof fieldsMapping[field] === 'string'
            ? fieldsMapping[field]
            : field;
        return {
          ...newError,
          [fieldName]: { message: error[field][0], type: 'pattern' },
        };
      }, {});

      return {
        ...backErrors,
        ...newError,
      };
    }, {});
  }
}
