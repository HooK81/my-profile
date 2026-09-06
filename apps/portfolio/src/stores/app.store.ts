import { create } from 'zustand';

import { type Locale } from '../constants';
import i18n, { toLocale } from '../utils/i18n';
import { getInitialTheme, persistTheme, type Theme } from '../utils/theme';

type State = {
  i18nReady: boolean;
  locale: Locale;
  activeSection: string;
  theme: Theme;
};

type Actions = {
  changeLocale: (locale: Locale) => void;
  setActiveSection: (section: string) => void;
  toggleTheme: () => void;
};

export const useAppStore = create<State & Actions>()((set) => {
  if (!i18n.isInitialized) {
    i18n.on('initialized', () =>
      set({ i18nReady: true, locale: toLocale(i18n.language) }),
    );
  }

  return {
    i18nReady: i18n.isInitialized,
    locale: toLocale(i18n.language),
    activeSection: 'hero',
    theme: getInitialTheme(),
    changeLocale: (locale) => set({ locale }),
    setActiveSection: (section) => set({ activeSection: section }),
    toggleTheme: () =>
      set((state) => {
        const theme: Theme = state.theme === 'dark' ? 'light' : 'dark';
        persistTheme(theme);
        return { theme };
      }),
  };
});
