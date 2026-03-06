import type { Profile } from 'my-profile-shared';
import { create } from 'zustand';

import { useAppStore } from './app.store';

type State = {
  profile: Profile | null;
};

type Actions = {
  updateProfile: (profile: Profile) => void;
};

export const useProfileStore = create<State & Actions>((set) => ({
  profile: null,
  updateProfile: (profile) => {
    set({ profile });
    useAppStore.getState().setIsLoaded(true);
  },
}));
