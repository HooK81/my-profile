import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from '../assets/locales/en.json';
import fr from '../assets/locales/fr.json';
import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES } from '../constants';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    supportedLngs: SUPPORTED_LOCALES,
    fallbackLng: DEFAULT_LOCALE,
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
  });

export const toLocale = (lang: string | undefined): Locale => {
  const base = lang?.split('-')[0];

  return SUPPORTED_LOCALES.includes(base as Locale)
    ? (base as Locale)
    : DEFAULT_LOCALE;
};

export default i18n;
