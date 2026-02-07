import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

// @ts-ignore
const storageInstance = new MMKV({
  id: 'DreamProject',
});

export const zustandStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    try {
      storageInstance.set(name, value);
    } catch (e) {
      console.error('MMKV setItem error:', e);
    }
  },
  getItem: (name: string) => {
    try {
      const value = storageInstance.getString(name);
      return value ?? null;
    } catch (e) {
      console.error('MMKV getItem error:', e);
      return null;
    }
  },
  removeItem: (name: string) => {
    try {
      storageInstance.delete(name);
    } catch (e) {
      console.error('MMKV removeItem error:', e);
    }
  },
};

export const AppStorageKeys = {
  TOKEN: '@token',
  USER_ID: '@user_id',
  PHONE: '@phone',
  KYC_STATUS: '@kyc_status',
  CURRENT_ROLE: '@current_role',
};

export default storageInstance;
