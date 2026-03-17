import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, clearAuthRelatedStorage, setKycStatus, setUserId, setHasSeenStory, AppStorageKeys } from '@/Helpers/AppStorage';
import type { User } from '@/types';
import { useRoleStore } from './useRoleStore';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

/**
 * Auth & onboarding flow:
 * - Onboarding: email/phone → OTP. Backend returns user + token (existing or new). If user exists and verified → Home; else Role → details → KYC (documents) → verified → Home.
 * - Logout: clears token, user, role, and all auth-related keys from device storage.
 * - Login again: OTP → backend; if user exists and verified → Home; else complete onboarding (role → KYC) → Home.
 * - After login, call fetchUserProfile() to load full user details (avatar, addresses, payment_methods, etc.) from DB.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  fetchUserProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof __DEV__ !== 'undefined' && __DEV__ && console?.log) {
          console.log('[Auth] token:', token);
        }
        set({ user, token });
        setKycStatus(user.kyc_status ?? 'pending');
        setUserId(user.id ?? '');
        // So verified users never see onboarding again after app close/reopen
        if ((user.kyc_status ?? '').toLowerCase() === 'verified') {
          setHasSeenStory(true);
        }
        // Set available roles from user data
        if (user.roles && user.roles.length > 0) {
          useRoleStore.getState().setAvailableRoles(user.roles);
        } else {
          // Default to user role if no roles specified
          useRoleStore.getState().setAvailableRoles(['user']);
        }
      },
      updateUser: (updates) => {
        set((state) => {
          const nextUser = state.user ? { ...state.user, ...updates } : null;
          if (nextUser && updates.kyc_status !== undefined) setKycStatus(updates.kyc_status);
          if (nextUser && updates.id !== undefined) setUserId(updates.id);
          return { user: nextUser };
        });
      },
      fetchUserProfile: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;
        const res = await APICall<{
          success?: boolean;
          data?: {
            user?: {
              id?: string;
              _id?: string;
              name?: string;
              email?: string;
              phone_number?: string;
              avatar_url?: string;
              kyc_status?: string;
              roles?: string[];
              current_role?: string;
              saved_addresses?: unknown[];
              payment_methods?: unknown[];
              location?: unknown;
              age?: number | null;
              gender?: string | null;
            };
          };
        }>('get', {}, ApiRoutes.profile.get, {}, token);
        if (__DEV__ && console?.log) {
          console.log('[Profile] GET /api/profile raw response:', { status: res.status, hasData: !!res.data, hasDataData: !!res.data?.data, hasUser: !!(res.data as { data?: { user?: unknown } })?.data?.user });
          if (res.data?.data && typeof (res.data as { data?: { user?: unknown } }).data === 'object') {
            const d = (res.data as { data: { user?: Record<string, unknown> } }).data;
            console.log('[Profile] Backend user object:', d.user ? { ...d.user, id: (d.user as { id?: unknown }).id ?? (d.user as { _id?: unknown })._id } : 'MISSING');
          }
        }
        const profileData = (res.data as { data?: { user?: Record<string, unknown> } })?.data;
        const userFromApi = profileData?.user as {
          id?: string;
          _id?: string;
          name?: string;
          email?: string;
          phone_number?: string;
          avatar_url?: string;
          kyc_status?: string;
          roles?: string[];
          saved_addresses?: unknown[];
          payment_methods?: unknown[];
          location?: unknown;
          age?: number | null;
          gender?: string | null;
        } | undefined;
        if (res.status === 200 && userFromApi) {
          const u = userFromApi;
          const id = u.id != null ? String(u.id) : (u._id != null ? String(u._id) : undefined);
          if (id) setUserId(id);
          if (u.kyc_status) setKycStatus(u.kyc_status);
          set((state) => {
            const prev = state.user;
            if (!prev) return state;
            const nextUser: User = {
              ...prev,
              id: prev.id,
              name: u.name ?? prev.name,
              email: u.email ?? prev.email,
              phone_number: u.phone_number ?? prev.phone_number,
              avatar_url: u.avatar_url ?? prev.avatar_url,
              kyc_status: (u.kyc_status as User['kyc_status']) ?? prev.kyc_status,
              roles: (u.roles as User['roles']) ?? prev.roles,
              saved_addresses: (u.saved_addresses as User['saved_addresses']) ?? prev.saved_addresses,
              payment_methods: (u.payment_methods as User['payment_methods']) ?? prev.payment_methods,
              location: (u.location as User['location']) ?? prev.location,
              age: u.age !== undefined ? u.age : prev.age,
              gender: u.gender !== undefined ? u.gender : prev.gender,
            };
            return { user: nextUser };
          });
        } else if (res.status === 200 && __DEV__) {
          console.warn('[Profile] GET /api/profile returned 200 but no user in response. Full res.data:', JSON.stringify(res.data, null, 2).slice(0, 500));
        }
      },
      logout: () => {
        set({ user: null, token: null });
        useRoleStore.getState().clearRole();
        clearAuthRelatedStorage();
      },
    }),
    {
      name: AppStorageKeys.AUTH_STORAGE,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
