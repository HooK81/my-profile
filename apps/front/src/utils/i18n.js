import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import moment from 'moment';
import 'moment/locale/fr';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const locales = ['en', 'fr'];

// I18Next configuration
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    whitelist: locales,
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'path'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: function (value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'upperFirst') return value.charAt(0).toUpperCase() + value.slice(1);
        return value;
      },
    }
  });

moment.locale(locales);
