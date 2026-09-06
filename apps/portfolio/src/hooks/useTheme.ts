import { useAppStore } from '../stores/app.store';
import type { Theme } from '../utils/theme';

type UseThemeResult = {
  theme: Theme;
  toggleTheme: () => void;
};

export function useTheme(): UseThemeResult {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return { theme, toggleTheme };
}
