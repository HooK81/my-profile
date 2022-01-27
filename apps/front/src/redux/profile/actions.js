/**
 * Profile redux actions
 */
import {
  GET_PROFILE_STARTED,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
} from './constants';
import { api } from '../../api';
import { setIsLoaded } from '../app/actions';
import { selectAppLocale } from '../app/selectors';

/**
 * Get user profile
 */
export const getProfile = () => {
  return (dispatch, getState) => {
    dispatch(getProfileStarted());

    return api
      .get(
        'get_user',
        {
          id: process.env.REACT_APP_PROFILE_ID,
          _locale: selectAppLocale(getState()),
        },
        {
          showError: false,
        },
      )
      .then((res) => {
        api.setHasToken(true);
        dispatch(getProfileSuccess(res.data)); // save profile
        dispatch(setIsLoaded()); // set app loaded
        return res;
      })
      .catch((error) => {
        dispatch(getProfileError(error.message));
        dispatch(setIsLoaded()); // set app loaded
        return error;
      });
  };
};

export function getProfileStarted() {
  return {
    type: GET_PROFILE_STARTED,
  };
}

export function getProfileSuccess(payload) {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: payload,
  };
}

export function getProfileError(payload) {
  return {
    type: GET_PROFILE_ERROR,
    payload: payload,
  };
}
