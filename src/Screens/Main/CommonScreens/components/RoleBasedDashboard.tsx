import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoleStore } from '@/hooks/useRoleStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import DashboardScreen from '../../DashboardScreen/DashboardScreen';
import DoctorDashboardScreen from '../../DOCTOR_MODEL/DoctorDashboardScreen/DoctorDashboardScreen';
import ClinicDashboardScreen from '../../CLINIC_MODEL/ClinicDashboardScreen/ClinicDashboardScreen';
import FactoryDashboardScreen from '../../FACTORY_MODEL/FactoryDashboardScreen/FactoryDashboardScreen';
import type { UserRole } from '@/types';

const RoleBasedDashboard = () => {
  const { currentRole, setRole, setAvailableRoles } = useRoleStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Initialize available roles on mount
    if (user) {
      const userRoles = (user.roles && user.roles.length > 0) 
        ? user.roles 
        : ['user', 'doctor', 'clinic', 'factory'] as UserRole[];
      
      setAvailableRoles(userRoles);
      
      // ONLY set a default role if there is absolutely no currentRole in storage
      // This prevents overwriting the user's saved selection on refresh
      if (!currentRole && userRoles.length > 0) {
        setRole(userRoles[0]);
      }
    }
  }, [user]);

  // Show loading while role is being determined
  if (!currentRole) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B2A99" />
      </View>
    );
  }

  // Render dashboard based on current role
  switch (currentRole) {
    case 'doctor':
      return <DoctorDashboardScreen />;
    case 'clinic':
      return <ClinicDashboardScreen />;
    case 'factory':
      return <FactoryDashboardScreen />;
    case 'user':
    default:
      return <DashboardScreen />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoleBasedDashboard;
