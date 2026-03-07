import { toLocale } from './i18n';

describe('toLocale', () => {
  it.each([
    { input: 'en', expected: 'en', label: 'exact match "en"' },
    { input: 'fr', expected: 'fr', label: 'exact match "fr"' },
    { input: 'en-US', expected: 'en', label: 'regional variant "en-US"' },
    { input: 'fr-FR', expected: 'fr', label: 'regional variant "fr-FR"' },
    { input: 'de', expected: 'en', label: 'unsupported locale "de"' },
    { input: 'ja', expected: 'en', label: 'unsupported locale "ja"' },
    { input: undefined, expected: 'en', label: 'undefined' },
  ])('should return "$expected" for $label', ({ input, expected }) => {
    expect(toLocale(input)).toBe(expected);
  });
});
