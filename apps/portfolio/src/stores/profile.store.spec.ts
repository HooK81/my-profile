import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('../utils/i18n');

import { useAppStore } from './app.store';
import { useProfileStore } from './profile.store';

describe('useProfileStore', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have profile set to null', () => {
      expect(useProfileStore.getState().profile).toBeNull();
    });
  });

  describe('updateProfile()', () => {
    it('should set the profile', () => {
      const profile = ProfileFactory.build();

      useProfileStore.getState().updateProfile(profile);

      expect(useProfileStore.getState().profile).toStrictEqual(profile);
    });

    it('should call setIsLoaded(true) on app store', () => {
      const profile = ProfileFactory.build();

      useProfileStore.getState().updateProfile(profile);

      expect(useAppStore.getState().isLoaded).toBe(true);
    });
  });
});
