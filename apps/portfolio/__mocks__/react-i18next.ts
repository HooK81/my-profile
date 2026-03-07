export const useTranslation = () => ({
  t: (key: string) => key,
  i18n: {
    changeLanguage: vi.fn(),
    language: 'en',
  },
});
