export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'portfolio-theme';

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

function readStoredTheme(): Theme | undefined {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}

export function getInitialTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) {
    return stored;
  }

  const prefersLight = window.matchMedia?.(
    '(prefers-color-scheme: light)',
  ).matches;

  return prefersLight ? 'light' : 'dark';
}

export function persistTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}
