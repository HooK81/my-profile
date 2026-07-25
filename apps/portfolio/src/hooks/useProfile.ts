import { useQuery } from '@tanstack/react-query';

import api from '../api/Api';
import { type Locale } from '../constants';
import { useAppStore } from '../stores/app.store';

export const profileQueryKey = (locale: Locale) => ['profile', locale] as const;

export function useProfile() {
  const locale = useAppStore((s) => s.locale);
  const i18nReady = useAppStore((s) => s.i18nReady);

  return useQuery({
    queryKey: profileQueryKey(locale),
    queryFn: async () => {
      await api.ensureAuth();
      return api.loadProfile(locale);
    },
    enabled: i18nReady,
  });
}
