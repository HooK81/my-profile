import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('../utils/i18n');
vi.mock('../api/Api');

import api from '../api/Api';
import { useAppStore } from '../stores/app.store';
import { createQueryWrapper } from '../test-utils';
import { useProfile } from './useProfile';

const mockedApi = vi.mocked(api);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('useProfile', () => {
  const profile = ProfileFactory.build();

  beforeEach(() => {
    mockedApi.loadProfile.mockResolvedValue(profile);
  });

  it('should not load the profile while i18n is not ready', () => {
    const { result } = renderHook(() => useProfile(), {
      wrapper: createQueryWrapper(),
    });

    expect(mockedApi.loadProfile).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  describe('when i18n is ready', () => {
    beforeEach(() => {
      useAppStore.setState({ i18nReady: true, locale: 'en' });
    });

    it('should authenticate then load the profile for the current locale', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.data).toEqual(profile));
      expect(mockedApi.ensureAuth).toHaveBeenCalledOnce();
      expect(mockedApi.loadProfile).toHaveBeenCalledWith('en');
    });

    it('should load the profile again when the locale changes', async () => {
      renderHook(() => useProfile(), { wrapper: createQueryWrapper() });

      await waitFor(() =>
        expect(mockedApi.loadProfile).toHaveBeenCalledWith('en'),
      );

      act(() => {
        useAppStore.setState({ locale: 'fr' });
      });

      await waitFor(() =>
        expect(mockedApi.loadProfile).toHaveBeenCalledWith('fr'),
      );
    });

    it('should expose the error when loading fails', async () => {
      mockedApi.loadProfile.mockRejectedValue(new Error('network error'));

      const { result } = renderHook(() => useProfile(), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.data).toBeUndefined();
    });
  });
});
