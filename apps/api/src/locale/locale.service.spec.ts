import { Test, TestingModule } from '@nestjs/testing';

import { LocaleService } from './locale.service.js';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocaleService],
    }).compile();

    service = await module.resolve<LocaleService>(LocaleService);
  });

  it('should set and get the locale', () => {
    const locale = 'fr';
    service.setLocale(locale);

    expect(service.getLocale()).toBe(locale);
  });

  describe('isSupportedLocale', () => {
    it.each(['en', 'fr'])('should return true for "%s"', (locale) => {
      expect(LocaleService.isSupportedLocale(locale)).toBe(true);
    });

    it.each(['de', 'es', '../etc/passwd', ''])(
      'should return false for "%s"',
      (locale) => {
        expect(LocaleService.isSupportedLocale(locale)).toBe(false);
      },
    );
  });
});
