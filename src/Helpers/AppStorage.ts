import type { StateStorage } from 'zustand/middleware';
import type { OnboardingProfile } from '@/types';

// In-memory fallback when MMKV is not available (e.g. undefined or not linked)
const memoryMap = new Map<string, string>();

function createStorage(): StateStorage {
  try {
    const { MMKV } = require('react-native-mmkv');
    if (typeof MMKV !== 'function') {
      return makeMemoryStorage();
    }
    const instance = new MMKV({ id: 'DreamProject' });
    return {
      setItem: (name: string, value: string) => {
        try {
          instance.set(name, value);
        } catch (e) {
          console.warn('MMKV setItem error:', e);
          memoryMap.set(name, value);
        }
      },
      getItem: (name: string) => {
        try {
          const value = instance.getString(name);
          return value ?? memoryMap.get(name) ?? null;
        } catch (e) {
          console.warn('MMKV getItem error:', e);
          return memoryMap.get(name) ?? null;
        }
      },
      removeItem: (name: string) => {
        try {
          instance.delete(name);
        } catch (e) {
          console.warn('MMKV removeItem error:', e);
        }
        memoryMap.delete(name);
      },
    };
  } catch (_e) {
    return makeMemoryStorage();
  }
}

function makeMemoryStorage(): StateStorage {
  return {
    setItem: (name: string, value: string) => {
      memoryMap.set(name, value);
    },
    getItem: (name: string) => {
      return memoryMap.get(name) ?? null;
    },
    removeItem: (name: string) => {
      memoryMap.delete(name);
    },
  };
}

export const zustandStorage = createStorage();

export const AppStorageKeys = {
  TOKEN: '@token',
  USER_ID: '@user_id',
  PHONE: '@phone',
  EMAIL: '@email',
  KYC_STATUS: '@kyc_status',
  CURRENT_ROLE: '@current_role',
  ONBOARDING_PROFILE: '@onboarding_profile',
  HAS_SEEN_STORY: '@has_seen_story',
  HAS_SEEN_APP_ONBOARDING: '@has_seen_app_onboarding',
  ONBOARDING_TOKEN: '@onboarding_token',
  PENDING_AUTH: '@pending_auth',
};

export function getOnboardingProfile(): string | null {
  const value = zustandStorage.getItem(AppStorageKeys.ONBOARDING_PROFILE);
  return typeof value === 'string' ? value : null;
}

/** Parsed onboarding form data (name, email, mobile, age, gender, role) for profile display and app use */
export function getOnboardingProfileParsed(): OnboardingProfile | null {
  const json = getOnboardingProfile();
  if (!json) return null;
  try {
    return JSON.parse(json) as OnboardingProfile;
  } catch {
    return null;
  }
}

export function setOnboardingProfile(json: string): void {
  zustandStorage.setItem(AppStorageKeys.ONBOARDING_PROFILE, json);
}

export function setHasSeenStory(seen: boolean): void {
  zustandStorage.setItem(AppStorageKeys.HAS_SEEN_STORY, seen ? '1' : '0');
}

export function getHasSeenStory(): boolean {
  return zustandStorage.getItem(AppStorageKeys.HAS_SEEN_STORY) === '1';
}

export function setHasSeenAppOnboarding(seen: boolean): void {
  zustandStorage.setItem(AppStorageKeys.HAS_SEEN_APP_ONBOARDING, seen ? '1' : '0');
}

export function getHasSeenAppOnboarding(): boolean {
  return zustandStorage.getItem(AppStorageKeys.HAS_SEEN_APP_ONBOARDING) === '1';
}

export function getOnboardingToken(): string | null {
  const raw = zustandStorage.getItem(AppStorageKeys.ONBOARDING_TOKEN);
  return typeof raw === 'string' ? raw : null;
}

export function setOnboardingToken(token: string): void {
  zustandStorage.setItem(AppStorageKeys.ONBOARDING_TOKEN, token);
}

export function clearOnboardingToken(): void {
  zustandStorage.removeItem(AppStorageKeys.ONBOARDING_TOKEN);
}

export function getPendingAuth(): string | null {
  const raw = zustandStorage.getItem(AppStorageKeys.PENDING_AUTH);
  return typeof raw === 'string' ? raw : null;
}

export function setPendingAuth(json: string): void {
  zustandStorage.setItem(AppStorageKeys.PENDING_AUTH, json);
}

export function clearPendingAuth(): void {
  zustandStorage.removeItem(AppStorageKeys.PENDING_AUTH);
}
