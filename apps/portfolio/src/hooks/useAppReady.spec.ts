import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('../utils/i18n');
vi.mock('../api/Api');

import api from '../api/Api';
import { useAppStore } from '../stores/app.store';
import { createQueryWrapper } from '../test-utils';
import { useAppReady } from './useAppReady';

const mockedApi = vi.mocked(api);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('useAppReady', () => {
  const profile = ProfileFactory.build();

  beforeEach(() => {
    mockedApi.loadProfile.mockResolvedValue(profile);
  });

  it('should not be ready while i18n is not ready, even with a cached profile', () => {
    const { result } = renderHook(() => useAppReady(), {
      wrapper: createQueryWrapper({ profile }),
    });

    expect(result.current).toBe(false);
  });

  it('should not be ready while the profile is still loading', () => {
    useAppStore.setState({ i18nReady: true, locale: 'en' });

    const { result } = renderHook(() => useAppReady(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current).toBe(false);
  });

  it('should not be ready when the profile failed to load', async () => {
    mockedApi.loadProfile.mockRejectedValue(new Error('network error'));
    useAppStore.setState({ i18nReady: true, locale: 'en' });

    const { result } = renderHook(() => useAppReady(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(mockedApi.loadProfile).toHaveBeenCalled());
    expect(result.current).toBe(false);
  });

  it('should be ready once i18n is initialized and the profile is loaded', async () => {
    useAppStore.setState({ i18nReady: true, locale: 'en' });

    const { result } = renderHook(() => useAppReady(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current).toBe(true));
  });
});
