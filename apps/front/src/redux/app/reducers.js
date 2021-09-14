/**
 * Profile redux reducers
 */

import { IS_LOADED, SET_LOCALE } from './constants';

/**
 * Default app state
 */
export const initialValue = {
  isLoaded: false,
  locale: null,
};

/**
 * APP Reducer
 * @param {object} previousState
 * @param {object} action
 */
export function appReducer(previousState = initialValue, action = {}) {
  switch (action.type) {
    case IS_LOADED:
      return {
        ...previousState,
        isLoaded: action.payload,
      };

    case SET_LOCALE:
      return {
        ...previousState,
        locale: action.payload,
      };

    default:
      return previousState;
  }
}
