import React from 'react';
import { useTheme } from '@/Theme/useTheme';

import { DashboardHeader } from './components/DashboardHeader';
import { CategoryGrid } from './components/CategoryGrid';
import { OfferSlider } from './components/OfferSlider';
import { QuickActionCards } from './components/QuickActionCards';
import { TrendingTests } from './components/TrendingTests';
import { HealthAdviceCard } from './components/HealthAdviceCard';
import { View, StyleSheet, StatusBar } from 'react-native';
import { CustomRefresh } from '@/Components/CustomRefresh';
import { useDashboard } from './hooks/useDashboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { ScreenWrapper } from '@/Components/ScreenWrapper';

const DashboardScreen = () => {
  const { theme } = useTheme();
  const { refreshing, onRefresh, categories, offers } = useDashboard();
  const insets = useSafeAreaInsets();

  return (
    <ScreenWrapper
      customHeader={<DashboardHeader />}
      scrollable={true}
      containerStyle={{ backgroundColor: theme.background }}
      contentStyle={{ paddingTop: 0 }}
    >
      <CategoryGrid categories={categories} />
      <AppSeparator size={20} />
      <OfferSlider offers={offers} />
      <AppSeparator size={20} />
      <QuickActionCards />
      <AppSeparator size={20} />
      <TrendingTests />
      <HealthAdviceCard />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 0 },
  // footerSpacer: { height: 20 },
});

export default DashboardScreen;
