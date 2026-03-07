import dayjs from 'dayjs';

import { calculateDuration, formatDate } from './date';
import i18n from './i18n';

vi.mock('./i18n');

describe('formatDate', () => {
  it('should format date with locale and MMMM YYYY pattern', () => {
    const result = formatDate('2024-03-15', 'en');

    expect(result).toBe('March 2024');
  });
});

describe('calculateDuration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should translate years and months', () => {
    calculateDuration('2020-01-01', '2022-07-01');

    expect(i18n.t).toHaveBeenCalledWith('resume.date.year', { count: 2 });
    expect(i18n.t).toHaveBeenCalledWith('resume.date.month', { count: 6 });
  });

  it('should only translate years when months is 0', () => {
    calculateDuration('2020-01-01', '2024-01-01');

    expect(i18n.t).toHaveBeenCalledWith('resume.date.year', { count: 4 });
    expect(i18n.t).not.toHaveBeenCalledWith(
      'resume.date.month',
      expect.anything(),
    );
  });

  it('should only translate months when less than a year', () => {
    calculateDuration('2024-01-01', '2024-04-01');

    expect(i18n.t).not.toHaveBeenCalledWith(
      'resume.date.year',
      expect.anything(),
    );
    expect(i18n.t).toHaveBeenCalledWith('resume.date.month', { count: 3 });
  });

  it('should use minimum 1 month when diff < 1 month', () => {
    calculateDuration('2024-01-01', '2024-01-15');

    expect(i18n.t).toHaveBeenCalledWith('resume.date.month', { count: 1 });
  });

  it('should use current date when endStr is omitted', () => {
    const now = dayjs();
    const start = now.subtract(2, 'month').format('YYYY-MM-DD');

    calculateDuration(start);

    expect(i18n.t).toHaveBeenCalledWith('resume.date.month', { count: 2 });
  });
});
