import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/Helpers/AppStorage';
import type { User, UserRole } from '@/types';
import { useRoleStore } from './useRoleStore';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        console.log('Setting Auth State:', { user, token });
        set({ user, token, isAuthenticated: true });
        
        // Set available roles from user data
        if (user.roles && user.roles.length > 0) {
          useRoleStore.getState().setAvailableRoles(user.roles);
        } else {
          // Default to user role if no roles specified
          useRoleStore.getState().setAvailableRoles(['user']);
        }
      },
      logout: () => {
        console.log('Logging out...');
        set({ user: null, token: null, isAuthenticated: false });
        useRoleStore.getState().clearRole();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => {
        console.log('Hydration starting...');
        return (rehydratedState, error) => {
          if (error) {
            console.log('Hydration error:', error);
          } else {
            console.log('Hydration finished:', rehydratedState);
          }
        };
      },
    },
  ),
);
