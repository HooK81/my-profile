import { Injectable, Scope } from '@nestjs/common';

export enum SupportedLocale {
  EN = 'en',
  FR = 'fr',
}

export const SUPPORTED_LOCALES = Object.values(SupportedLocale);
export const DEFAULT_LOCALE = SupportedLocale.EN;

@Injectable({ scope: Scope.REQUEST })
export class LocaleService {
  private locale: string = DEFAULT_LOCALE;

  static isSupportedLocale(value: string): boolean {
    return SUPPORTED_LOCALES.includes(value as SupportedLocale);
  }

  setLocale(locale: string) {
    this.locale = locale;
  }

  getLocale(): string {
    return this.locale;
  }
}
