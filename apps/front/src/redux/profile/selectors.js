/**
 * Profile redux selectors
 */
export function selectApiProfile(state) {
  return state.api.profile;
}
export function selectApiProfileData(state) {
  return selectApiProfile(state).data;
}
export function selectApiProfilePending(state) {
  return selectApiProfile(state).pending;
}
export function selectApiProfileError(state) {
  return selectApiProfile(state).error;
}
