/**
 * Token redux reducers
 * @author Julien CROCHET <julien@crochet.me>
 */

import { API_TOKEN_STARTED, API_TOKEN_SUCCESS, API_TOKEN_ERROR } from './constants';

/**
 * Default token state
 */
export const initialValue = {
  pending: false,
  token: null,
  error: null
};

/**
 * Token Reducer
 * @param {object} previousState
 * @param {object} action
 */
export function apiTokenReducer(previousState = initialValue, action = {}) {
  switch (action.type) {

    case API_TOKEN_STARTED:
      return {
        ...previousState,
        pending: true,
      };

    case API_TOKEN_SUCCESS:
      return {
        ...previousState,
        token: action.payload,
        error: null,
        pending: false,
      };

    case API_TOKEN_ERROR:
      return {
        ...previousState,
        token: null,
        error: action.payload,
        pending: false,
      };

    default:
      return previousState;
  }
}
