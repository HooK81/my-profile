import { useEffect, useState } from 'react';

import api from '../api/Api';
import { useAppStore } from '../stores/app.store';

export function useProfileFileUrl(file: string | undefined): string | null {
  const locale = useAppStore((s) => s.locale);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    let objectUrl: string;
    const load = async () => {
      const blob = await api.getFile(locale, file);
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    };
    void load();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [locale, file]);

  return url;
}
