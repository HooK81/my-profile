import { IS_LOADED, SET_LOCALE } from './constants';

export function setIsLoaded(isLoaded = true) {
  return {
    type: IS_LOADED,
    payload: isLoaded,
  };
}

export function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: locale,
  };
}
