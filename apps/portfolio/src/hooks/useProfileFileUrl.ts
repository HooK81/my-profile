import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import api from '../api/Api';
import { type Locale } from '../constants';
import { useAppStore } from '../stores/app.store';

export const profileFileQueryKey = (locale: Locale, file: string) =>
  ['profile-file', locale, file] as const;

export function useProfileFileUrl(file: string | undefined): string | null {
  const locale = useAppStore((s) => s.locale);

  const { data: blob } = useQuery({
    queryKey: profileFileQueryKey(locale, file!),
    queryFn: () => api.getFile(locale, file!),
    enabled: !!file,
  });

  // The blob is cached by the query, its object URL is not: each consumer
  // creates its own and revokes it when it unmounts or the blob changes.
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);

  useEffect(() => {
    if (!url) {
      return;
    }

    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}
