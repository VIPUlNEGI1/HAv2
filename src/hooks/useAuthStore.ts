import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/Helpers/AppStorage';
import type { User } from '@/types';
import { useRoleStore } from './useRoleStore';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
        
        // Set available roles from user data
        if (user.roles && user.roles.length > 0) {
          useRoleStore.getState().setAvailableRoles(user.roles);
        } else {
          // Default to user role if no roles specified
          useRoleStore.getState().setAvailableRoles(['user']);
        }
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
      logout: () => {
        set({ user: null, token: null });
        useRoleStore.getState().clearRole();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
