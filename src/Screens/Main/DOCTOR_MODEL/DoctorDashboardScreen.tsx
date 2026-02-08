import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { DoctorDashboardHeader } from './components/DoctorDashboardHeader';
import { DoctorQuickActions } from './components/DoctorQuickActions';
import { DoctorServicesGrid } from './components/DoctorServicesGrid';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { SaudiRiyal, ScrollIcon } from 'lucide-react-native';

const DoctorDashboardScreen = () => {
  const { theme, shadows } = useTheme();

  return (
  <ScrollView> 
      <DoctorDashboardHeader />
      
      <DoctorQuickActions />
      <DoctorServicesGrid />
      
      {/* Recent Activity Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
        <View style={[styles.activityCard, { backgroundColor: theme.surface, ...shadows }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No recent activity to show
          </Text>
        </View>
      </View>
      
      <AppSeparator size={30} />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  activityCard: {
    borderRadius: 20,
    padding: 24,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DoctorDashboardScreen;
