import { Injectable, Scope } from '@nestjs/common';

export const DEFAULT_LOCALE = 'en';

@Injectable({ scope: Scope.REQUEST })
export class LocaleService {
  private locale: string = DEFAULT_LOCALE;

  setLocale(locale: string) {
    this.locale = locale;
  }

  getLocale(): string {
    return this.locale;
  }
}
