import type { Locale } from '../constants';

export const profileQueryKey = (locale: Locale) => ['profile', locale] as const;

export const profileFileQueryKey = (locale: Locale, file: string) =>
  ['profile-file', locale, file] as const;
