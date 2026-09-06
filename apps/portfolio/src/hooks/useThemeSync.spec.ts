import { act, renderHook } from '@testing-library/react';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('../utils/i18n');

import { useAppStore } from '../stores/app.store';
import { useThemeSync } from './useThemeSync';

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe('useThemeSync', () => {
  it('should apply the current theme to the root element', () => {
    useAppStore.setState({ theme: 'dark' });

    renderHook(() => useThemeSync());

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('should re-apply the theme when the store changes', () => {
    useAppStore.setState({ theme: 'dark' });

    renderHook(() => useThemeSync());

    act(() => {
      useAppStore.setState({ theme: 'light' });
    });

    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
