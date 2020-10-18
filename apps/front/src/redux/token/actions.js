/**
 * Token redux action
 * @author Julien CROCHET <julien@crochet.me>
 */

import { API_TOKEN_STARTED, API_TOKEN_SUCCESS, API_TOKEN_ERROR } from './constants';
import { api } from '../../api';
import { setIsLoaded } from '../app/actions';

/**
 * Get API Token Action
 */
export const getToken = () => {
  return (dispatch, getState) => {
    dispatch(getTokenStarted());
    // Get credentials and unique key
    const credentials = api.getCredentials();
    const { key, ...usernameAndPassword } = credentials;

    return api
      .post(
        'login',
        usernameAndPassword,
        {},
        {
          showError: false,
          headers: {
            Key: key,
          },
        },
      ) // Get login
      .then((res) => {
        api.setToken(res.data.token);
        dispatch(getTokenSuccess(res.data.token));
        return res;
      })
      .catch((error) => {
        api.setToken(null);
        dispatch(getTokenError(error.message));
        dispatch(setIsLoaded()); // set app loaded
        throw error;
      });
  };
};

export function getTokenStarted() {
  return {
    type: API_TOKEN_STARTED,
  };
}

export function getTokenSuccess(payload) {
  return {
    type: API_TOKEN_SUCCESS,
    payload: payload,
  };
}

export function getTokenError(payload) {
  return {
    type: API_TOKEN_ERROR,
    payload: payload,
  };
}
