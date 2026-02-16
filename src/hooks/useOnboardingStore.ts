import { create } from 'zustand';

interface OnboardingState {
  /** Set to true when user taps "Go to dashboard" on Story so root re-renders and shows Home */
  storyCompleted: boolean;
  setStoryCompleted: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  storyCompleted: false,
  setStoryCompleted: (value) => set({ storyCompleted: value }),
}));
