import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, AppStorageKeys } from '@/Helpers/AppStorage';

interface OnboardingState {
  /** Set to true when user taps "Go to dashboard" on Story so root re-renders and shows Home */
  storyCompleted: boolean;
  setStoryCompleted: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      storyCompleted: false,
      setStoryCompleted: (value) => set({ storyCompleted: value }),
    }),
    {
      name: AppStorageKeys.ONBOARDING_STORAGE,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ storyCompleted: state.storyCompleted }),
    },
  ),
);
