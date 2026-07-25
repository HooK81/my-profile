import { create } from 'zustand';

import { type Locale } from '../constants';
import i18n, { toLocale } from '../utils/i18n';

type State = {
  i18nReady: boolean;
  locale: Locale;
  activeSection: string;
};

type Actions = {
  changeLocale: (locale: Locale) => void;
  setActiveSection: (section: string) => void;
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
    changeLocale: (locale) => set({ locale }),
    setActiveSection: (section) => set({ activeSection: section }),
  };
});
