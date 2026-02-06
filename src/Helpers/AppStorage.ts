import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const storage = new MMKV({
  id: 'DreamProject',
});

export const zustandStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    try {
      storage.set(name, value);
    } catch (e) {
      console.error('MMKV setItem error:', e);
    }
  },
  getItem: (name: string) => {
    try {
      const value = storage.getString(name);
      return value ?? null;
    } catch (e) {
      console.error('MMKV getItem error:', e);
      return null;
    }
  },
  removeItem: (name: string) => {
    try {
      storage.delete(name);
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
};

export default storage;
