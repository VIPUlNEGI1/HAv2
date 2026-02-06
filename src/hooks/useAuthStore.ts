import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/Helpers/AppStorage';

interface User {
  id: string;
  phone_number: string;
  name: string;
  // add other user fields as needed
}

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
      },
      logout: () => {
        console.log('Logging out...');
        set({ user: null, token: null, isAuthenticated: false });
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
