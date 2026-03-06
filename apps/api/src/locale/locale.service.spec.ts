import { Test, TestingModule } from '@nestjs/testing';

import { LocaleService } from './locale.service';

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
});
