import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { FactoryDashboardHeader } from './components/FactoryDashboardHeader';
import { FactoryQuickActions } from './components/FactoryQuickActions';
import { FactoryServicesGrid } from './components/FactoryServicesGrid';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const FactoryDashboardScreen = () => {
  const { theme, shadows } = useTheme();

  return (
    
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      > 
        <FactoryDashboardHeader />
        
        <FactoryQuickActions />
        <FactoryServicesGrid />
        
        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
          <View style={[styles.activityCard, { backgroundColor: theme.surface, ...shadows }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No recent activity to show
            </Text>
          </View>
        </View>
        
        <AppSeparator size={verticalScale(30)} />
      </ScrollView>
  
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
  emptyText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    lineHeight: moderateScale(20),
  },
});

export default FactoryDashboardScreen;
