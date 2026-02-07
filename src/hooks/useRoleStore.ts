import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/Helpers/AppStorage';
import type { UserRole } from '@/types';

interface RoleState {
  currentRole: UserRole | null;
  availableRoles: UserRole[];
  setRole: (role: UserRole) => void;
  setAvailableRoles: (roles: UserRole[]) => void;
  clearRole: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      currentRole: null,
      availableRoles: [],
      setRole: (role) => {
        console.log('Setting role:', role);
        set({ currentRole: role });
      },
      setAvailableRoles: (roles) => {
        console.log('Setting available roles:', roles);
        set({ availableRoles: roles });
      },
      clearRole: () => {
        set({ currentRole: null, availableRoles: [] });
      },
    }),
    {
      name: 'role-storage',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: (state) => {
        console.log('Rehydration started');
        return (state, error) => {
          if (error) {
            console.log('An error happened during hydration', error);
          } else {
            console.log('Hydration finished, currentRole:', state?.currentRole);
          }
        };
      },
    },
  ),
);
