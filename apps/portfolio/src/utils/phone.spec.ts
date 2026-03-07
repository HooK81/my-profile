import { formatPhone } from './phone';

describe('formatPhone', () => {
  it('should format a valid phone number in international format', () => {
    expect(formatPhone('+33612345678')).toBe('+33 6 12 34 56 78');
  });

  it('should return the raw input when the number is invalid', () => {
    expect(formatPhone('not-a-number')).toBe('not-a-number');
  });
});
