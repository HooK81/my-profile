import { act, renderHook } from '@testing-library/react';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('../utils/i18n');

import { useAppStore } from '../stores/app.store';
import { useTheme } from './useTheme';

afterEach(() => {
  window.localStorage.clear();
});

describe('useTheme', () => {
  it('should expose the current theme', () => {
    useAppStore.setState({ theme: 'light' });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('should toggle the theme through the store', () => {
    useAppStore.setState({ theme: 'dark' });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(useAppStore.getState().theme).toBe('light');
  });
});
