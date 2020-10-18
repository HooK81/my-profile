/**
 * Profile redux reducers
 * @author Julien CROCHET <julien@crochet.me>
 */
import _ from 'lodash/fp';
import { GET_PROFILE_STARTED, GET_PROFILE_SUCCESS, GET_PROFILE_ERROR } from './constants';

/**
 * Default profile state
 */
export const initialValue = {
  pending: false,
  data: null,
  error: null
};

/**
 * Profile Reducer
 * @param {object} previousState
 * @param {object} action
 */
export function apiProfileReducer(previousState = initialValue, action = {}) {
  switch (action.type) {

    case GET_PROFILE_STARTED:
      return {
        ...previousState,
        pending: true,
      };

    case GET_PROFILE_SUCCESS:
      return {
        ...previousState,
        data: _.cloneDeep(action.payload),
        error: null,
        pending: false,
      };

    case GET_PROFILE_ERROR:
      return {
        ...previousState,
        data: null,
        error: action.payload,
        pending: false,
      };

    default:
      return previousState;
  }
}
