import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export function formatPhone(raw: string): string {
  const parsed = parsePhoneNumberFromString(raw);
  return parsed ? parsed.formatInternational() : raw;
}
