/**
 * Profile redux selectors
 */
import i18n from 'i18next';

export function selectApp(state) {
  return state.app;
}
export function selectAppIsLoaded(state) {
  return state.app.isLoaded;
}
export function selectAppLocale(state) {
  return state.app.locale !== null ? state.app.locale : i18n.language;
}
