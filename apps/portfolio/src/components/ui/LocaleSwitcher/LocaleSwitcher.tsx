import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type Locale, SUPPORTED_LOCALES } from '../../../constants';
import { useAppStore } from '../../../stores/app.store';
import i18n from '../../../utils/i18n';
import styles from './LocaleSwitcher.module.scss';

const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
};

const LOCALES = SUPPORTED_LOCALES.map((code) => ({
  code,
  flag: LOCALE_FLAGS[code],
}));

type Props = {
  layout: 'dropdown' | 'inline';
  onChange?: (locale: Locale) => void;
};

function LocaleSwitcher({ layout, onChange }: Props) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const changeLocale = useAppStore((s) => s.changeLocale);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (code: Locale) => {
    void i18n.changeLanguage(code);
    changeLocale(code);
    setOpen(false);
    onChange?.(code);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const active = LOCALES.find((l) => l.code === locale)!;

  if (layout === 'inline') {
    return (
      <div className={styles.inline}>
        {LOCALES.map(({ code, flag }) => (
          <button
            key={code}
            onClick={() => handleChange(code)}
            className={locale === code ? styles.active : ''}
            aria-label={t(`locale.${code}`)}
          >
            <span className={styles.flag}>{flag}</span>
            <span className={styles.code}>{code}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.dropdown}>
      <button
        className={`${styles.trigger} ${open ? styles.open : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.flag}>{active.flag}</span>
        <span className={styles.code}>{active.code}</span>
        <span className={styles.caret}>▾</span>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          {LOCALES.map(({ code, flag }) => (
            <li key={code}>
              <button
                onClick={() => handleChange(code)}
                className={locale === code ? styles.active : ''}
                aria-label={t(`locale.${code}`)}
                role="option"
                aria-selected={locale === code}
              >
                <span className={styles.flag}>{flag}</span>
                <span className={styles.code}>{code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocaleSwitcher;
