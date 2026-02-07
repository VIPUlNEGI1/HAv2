/**
 * Hook to manage relationships between different roles
 * - Doctor can list services, provide consultations
 * - Clinic can provide medicine, buy from factory
 * - Factory can supply medicines in bulk to clinics
 * - User can buy from clinics
 */

import { useRoleStore } from './useRoleStore';
import type { UserRole } from '@/types';

export const useRoleRelations = () => {
  const { currentRole } = useRoleStore();

  /**
   * Check if current role can interact with another role
   */
  const canInteractWith = (targetRole: UserRole): boolean => {
    if (!currentRole) return false;

    const relationships: Record<UserRole, UserRole[]> = {
      user: ['doctor', 'clinic'], // Users can interact with doctors and clinics
      doctor: ['user', 'clinic'], // Doctors can interact with users and clinics
      clinic: ['user', 'factory'], // Clinics can interact with users and factories
      factory: ['clinic'], // Factories can interact with clinics
    };

    return relationships[currentRole]?.includes(targetRole) || false;
  };

  /**
   * Get available actions for current role
   */
  const getAvailableActions = () => {
    if (!currentRole) return [];

    const actions: Record<UserRole, string[]> = {
      user: [
        'Book Doctor Consultation',
        'Buy Medicine from Clinic',
        'Schedule Lab Tests',
        'View Appointments',
      ],
      doctor: [
        'List Services',
        'Provide Video Consultation',
        'Provide Audio Consultation',
        'Chat Consultation',
        'Manage Appointments',
      ],
      clinic: [
        'Manage Inventory',
        'Sell Medicine to Users',
        'Buy Medicine from Factory',
        'View Customer Orders',
        'Manage Stock',
      ],
      factory: [
        'Manage Products',
        'Supply to Clinics (Bulk)',
        'View Clinic Orders',
        'Manage Shipping',
      ],
    };

    return actions[currentRole] || [];
  };

  /**
   * Check if role can perform a specific action
   */
  const canPerformAction = (action: string): boolean => {
    return getAvailableActions().includes(action);
  };

  return {
    currentRole,
    canInteractWith,
    getAvailableActions,
    canPerformAction,
  };
};
