import type { StateStorage } from 'zustand/middleware';
import type { OnboardingProfile } from '@/types';

// In-memory fallback when no persistent storage is available
const memoryMap = new Map<string, string>();

/** Persistent storage using AsyncStorage (survives app restart and Metro reload). */
function makeAsyncStorage(): StateStorage {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return {
    setItem: (name: string, value: string) => {
      return AsyncStorage.setItem(name, value);
    },
    getItem: (name: string) => {
      return AsyncStorage.getItem(name);
    },
    removeItem: (name: string) => {
      return AsyncStorage.removeItem(name);
    },
  };
}

function createStorage(): StateStorage {
  try {
    const { MMKV } = require('react-native-mmkv');
    if (typeof MMKV !== 'function') {
      return makeAsyncStorage();
    }
    const instance = new MMKV({ id: 'DreamProject' });
    if (__DEV__ && console?.log) {
      console.log('[AppStorage] Using MMKV (persists until app delete)');
    }
    return {
      setItem: (name: string, value: string) => {
        try {
          instance.set(name, value);
        } catch (e) {
          if (__DEV__) console.warn('MMKV setItem error:', e);
          memoryMap.set(name, value);
        }
      },
      getItem: (name: string) => {
        try {
          const value = instance.getString(name);
          return value ?? memoryMap.get(name) ?? null;
        } catch (e) {
          if (__DEV__) console.warn('MMKV getItem error:', e);
          return memoryMap.get(name) ?? null;
        }
      },
      removeItem: (name: string) => {
        try {
          instance.delete(name);
        } catch (e) {
          if (__DEV__) console.warn('MMKV removeItem error:', e);
        }
        memoryMap.delete(name);
      },
    };
  } catch (_e) {
    if (__DEV__ && console?.log) {
      console.log('[AppStorage] MMKV not available, using AsyncStorage (persists until app delete)');
    }
    return makeAsyncStorage();
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
  /** Zustand persist key for auth store (user + token). Cleared on logout. */
  AUTH_STORAGE: 'auth-storage',
  /** Zustand persist key for role store. Cleared on logout. */
  ROLE_STORAGE: 'role-storage',
  /** Zustand persist key for onboarding (story completed). Survives refresh. */
  ONBOARDING_STORAGE: 'onboarding-storage',
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

export function clearHasSeenStory(): void {
  zustandStorage.removeItem(AppStorageKeys.HAS_SEEN_STORY);
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

export function getKycStatus(): string | null {
  const v = zustandStorage.getItem(AppStorageKeys.KYC_STATUS);
  return typeof v === 'string' ? v : null;
}

export function setKycStatus(status: string): void {
  zustandStorage.setItem(AppStorageKeys.KYC_STATUS, status);
}

export function getUserId(): string | null {
  const v = zustandStorage.getItem(AppStorageKeys.USER_ID);
  return typeof v === 'string' ? v : null;
}

export function setUserId(id: string): void {
  zustandStorage.setItem(AppStorageKeys.USER_ID, id);
}

export function clearKycAndUserId(): void {
  zustandStorage.removeItem(AppStorageKeys.KYC_STATUS);
  zustandStorage.removeItem(AppStorageKeys.USER_ID);
}


export function clearAuthRelatedStorage(): void {
  clearOnboardingToken();
  clearPendingAuth();
  clearKycAndUserId();
  clearHasSeenStory();
  // Remove persisted auth, role, and onboarding so next login gets a clean slate
  zustandStorage.removeItem(AppStorageKeys.AUTH_STORAGE);
  zustandStorage.removeItem(AppStorageKeys.ROLE_STORAGE);
  zustandStorage.removeItem(AppStorageKeys.ONBOARDING_STORAGE);
}

/** Read token from persisted auth store (Zustand persist format). Use for initial route so token survives refresh. */
export function getPersistedAuthToken(): string | null {
  const raw = zustandStorage.getItem(AppStorageKeys.AUTH_STORAGE);
  if (typeof raw !== 'string') return null;
  try {
    const data = JSON.parse(raw) as { state?: { token?: string | null } };
    const token = data?.state?.token;
    return typeof token === 'string' && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}
