import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { FactoryDashboardHeader } from '../components/FactoryDashboardHeader';
import { FactoryQuickActions } from '../components/FactoryQuickActions';
import { FactoryServicesGrid } from '../components/FactoryServicesGrid';
import AppSeparator from '@/Components/AppSeparator/AppSeparator';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useFactoryDashboard } from './hooks/useFactoryDashboard';

const FactoryDashboardScreen = () => {
  const { theme, shadows } = useTheme();
  const { refreshing, handleRefresh, recentOrders } = useFactoryDashboard();

  return (
    <ScreenWrapper scrollable={true} customHeader={<FactoryDashboardHeader />}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        <FactoryQuickActions />
        <FactoryServicesGrid />

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Orders</Text>
          {recentOrders.length === 0 ? (
            <View style={[styles.activityCard, { backgroundColor: theme.surface, ...shadows }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No recent orders</Text>
            </View>
          ) : (
            recentOrders.map((order) => (
              <View key={order.id} style={[styles.activityCard, styles.orderRow, { backgroundColor: theme.surface, borderColor: theme.border, ...shadows }]}>
                <Text style={[styles.orderId, { color: theme.text }]} numberOfLines={1}>{order.order_number ?? order.id}</Text>
                <Text style={[styles.orderMeta, { color: theme.textSecondary }]}>
                  ₹{order.total ?? 0} · {order.shipping_status ?? order.status ?? 'pending'}
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
  orderRow: {
    minHeight: undefined,
    marginBottom: verticalScale(12),
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: moderateScale(12),
  },
  emptyText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    lineHeight: moderateScale(20),
  },
});

export default FactoryDashboardScreen;
