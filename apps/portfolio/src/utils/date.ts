import 'dayjs/locale/fr';

import dayjs from 'dayjs';

import i18n from './i18n';

export function formatDate(dateStr: string, locale: string): string {
  return dayjs(dateStr).locale(locale).format('MMMM YYYY');
}

export function calculateDuration(startStr: string, endStr?: string): string {
  const start = dayjs(startStr);
  const end = endStr ? dayjs(endStr) : dayjs();

  let totalMonths = end.diff(start, 'month');
  if (totalMonths < 1) {
    totalMonths = 1;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(i18n.t('resume.date.year', { count: years }));
  }
  if (months > 0) {
    parts.push(i18n.t('resume.date.month', { count: months }));
  }

  return parts.join(' ');
}
