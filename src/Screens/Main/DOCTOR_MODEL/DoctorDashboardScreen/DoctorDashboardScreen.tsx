import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { DoctorDashboardHeader } from '../components/DoctorDashboardHeader';
import { DoctorQuickActions } from '../components/DoctorQuickActions';
import { DoctorServicesGrid } from '../components/DoctorServicesGrid';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useDoctorDashboard } from './hooks/useDoctorDashboard';

const DoctorDashboardScreen = () => {
  const { theme, shadows } = useTheme();
  const { refreshing, handleRefresh, recentAppointments } = useDoctorDashboard();

  return (
    <ScreenWrapper scrollable={true} customHeader={<DoctorDashboardHeader />}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        <DoctorQuickActions />
        <DoctorServicesGrid />

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Appointments</Text>
          {recentAppointments.length === 0 ? (
            <View style={[styles.activityCard, { backgroundColor: theme.surface, ...shadows }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No recent appointments
              </Text>
            </View>
          ) : (
            recentAppointments.map((apt) => (
              <View key={apt.id} style={[styles.activityCard, styles.appointmentRow, { backgroundColor: theme.surface, borderColor: theme.border, ...shadows }]}>
                <Text style={[styles.appointmentPatient, { color: theme.text }]} numberOfLines={1}>{apt.patient_name ?? 'Patient'}</Text>
                <Text style={[styles.appointmentMeta, { color: theme.textSecondary }]}>
                  {apt.appointment_date ?? ''} · {apt.appointment_time ?? ''} · {apt.type ?? 'consultation'}
                </Text>
              </View>
            ))
          )}
        </View>

        <AppSeparator size={verticalScale(30)} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(30),
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(26),
  },
  activityCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(24),
    minHeight: verticalScale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentRow: {
    minHeight: undefined,
    marginBottom: verticalScale(12),
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  appointmentPatient: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: 4,
  },
  appointmentMeta: {
    fontSize: moderateScale(12),
  },
  emptyText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    lineHeight: moderateScale(20),
  },
});

export default DoctorDashboardScreen;
