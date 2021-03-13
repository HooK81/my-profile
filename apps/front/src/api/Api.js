import axios from 'axios';
import uuidv4 from 'uuid/v4';
import { PasswordEncoder } from './passwordEncoder';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import { routing } from './routing/index';
import _ from 'lodash';

export const HTTP_OK = 200;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_MULTIPLE_CHOICES = 300;
export const HTTP_INTERNAL_SERVER_ERROR = 500;

/**
 * Api error base class
 * @author Julien CROCHET <julien@crochet.me>
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
 * @author Julien CROCHET <julien@crochet.me>
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
        if (error.response.status === HTTP_UNAUTHORIZED && !originalRequest._retry) {
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

  /**
   * GET
   * @param {string} Name
   * @param {object} routeParameters
   * @param {AxiosRequestConfig} config
   */
  async get(routeName, routeParameters = {}, config = {}) {
    config = _.defaults(config, { showError: true, errorAutoClose: true });
    try {
      const { showError, errorAutoClose, ...axiosConfig } = config;
      const url = this.buildUrl(routeName, routeParameters);
      return await this.axios.get(url, axiosConfig).catch((error) => {
        // error
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
        throw new ApiError(errorMEssage, error.response.status, error.response.data);
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
    config = _.defaults(config, { showError: true, errorAutoClose: true });
    try {
      const { showError, errorAutoClose, ...axiosConfig } = config;
      const url = this.buildUrl(routeName, routeParameters);

      return await this.axios.post(url, data, axiosConfig).catch((error) => {
        // error
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
        throw new ApiError(errorMEssage, error.response.status, error.response.data);
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
    let url;
    if (routeParameters !== null) {
      url = routing.generate(routeName, routeParameters, absolute);
    } else {
      url = routing.generate(routeName, {}, absolute);
    }
    return url;
  }

  /**
   * Build error message
   * @param {string} routeName
   * @param {string} errorMessage
   */
  buildApiErrorMessage(routeName, errorMessage) {
    const key = `api.error.${routeName}`;
    let msg = '';
    if (i18n.exists(key)) {
      msg = i18n.t(key, { msg: errorMessage });
    } else {
      msg = errorMessage;
    }
    return msg;
  }

  /**
   * Build form error object
   * @param {object} errors from API
   * @param {object} fields name mapping
   */
  buildFormErrors(errors, fieldsMapping = {}) {
    let backErrors = {};
    if (typeof errors !== 'object') {
      return backErrors;
    }

    errors.map((error) => {
      for (const field in error) {
        let fieldName = field;
        if (typeof fieldsMapping[field] === 'string') {
          fieldName = fieldsMapping[field];
        }
        backErrors[fieldName] = { message: error[field][0], type: 'pattern' };
      }
    });

    return backErrors;
  }
}
