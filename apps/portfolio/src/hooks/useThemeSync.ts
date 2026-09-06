import { useEffect } from 'react';

import { applyTheme } from '../utils/theme';
import { useTheme } from './useTheme';

export function useThemeSync(): void {
  const { theme } = useTheme();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
}
