/**
 * Token redux selectors
 * @author Julien CROCHET <julien@crochet.me>
 */
export function selectApiToken(state) {
  return state.api.token;
}
export function selectApiTokenData(state) {
  return selectApiToken(state).token;
}
export function selectApiTokenPending(state) {
  return selectApiToken(state).pending;
}
export function selectApiTokenError(state) {
  return selectApiToken(state).error;
}
