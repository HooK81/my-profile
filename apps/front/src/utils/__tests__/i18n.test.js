/**
 * i18n Test Suites
 */
import '../i18n';
import i18n from 'i18next';

describe('i18n', () => {
  it("Should i18n module initialzed correctly", () => {
    expect(i18n.modules.backend).toBeDefined();
    expect(i18n.modules.languageDetector).toBeDefined();
    expect(i18n.options.detection.order.length).toBeGreaterThan(0);
    expect(i18n.options.fallbackLng).toContain('en');
  });

  it("Should i18n format works correctly", () => {
    expect(i18n.format('test', 'uppercase')).toBe('TEST');
    expect(i18n.format('test', 'upperFirst')).toBe('Test');
    expect(i18n.format('test', 'none')).toBe('test');
  });
});
