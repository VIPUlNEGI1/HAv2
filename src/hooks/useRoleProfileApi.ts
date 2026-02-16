/**
 * Returns the correct profile API routes for the current role.
 * Use this to switch APIs by role: doctor → doctors/profile, factory → factories/profile, etc.
 * Each role has its own backend table (Doctor, Clinic, Factory) and endpoints.
 */
import { useMemo } from 'react';
import { useRoleStore } from '@/hooks/useRoleStore';
import { ApiRoutes } from '@/api/routes';
import type { UserRole } from '@/types';

export interface RoleProfileEndpoints {
  getProfile: string | null;
  updateProfile: string | null;
  createProfile: string | null;
  role: UserRole | null;
}

export function useRoleProfileApi(): RoleProfileEndpoints {
  const currentRole = useRoleStore((s) => s.currentRole);

  return useMemo((): RoleProfileEndpoints => {
    switch (currentRole) {
      case 'doctor':
        return {
          getProfile: ApiRoutes.doctors.profile,
          updateProfile: ApiRoutes.doctors.profile,
          createProfile: ApiRoutes.doctors.create,
          role: 'doctor',
        };
      case 'clinic':
        return {
          getProfile: ApiRoutes.clinics.profile,
          updateProfile: ApiRoutes.clinics.profile,
          createProfile: ApiRoutes.clinics.create,
          role: 'clinic',
        };
      case 'factory':
        return {
          getProfile: ApiRoutes.factories.profile,
          updateProfile: ApiRoutes.factories.profile,
          createProfile: ApiRoutes.factories.create,
          role: 'factory',
        };
      case 'user':
      default:
        return {
          getProfile: ApiRoutes.auth.me,
          updateProfile: ApiRoutes.auth.profile,
          createProfile: null,
          role: currentRole ?? 'user',
        };
    }
  }, [currentRole]);
}
