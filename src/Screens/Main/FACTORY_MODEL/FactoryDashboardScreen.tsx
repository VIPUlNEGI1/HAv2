import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Factory,
  Package,
  TrendingUp,
  ShoppingCart,
  Building2,
  ArrowRight,
  Truck,
} from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const FactoryDashboardScreen = () => {
  const { theme, shadows } = useTheme();

  const stats = [
    { label: 'Total Orders', value: '1.2K', icon: ShoppingCart, color: '#4B2A99' },
    { label: 'Products', value: '450', icon: Package, color: '#10B981' },
    { label: 'Clinics', value: '23', icon: Building2, color: '#3B82F6' },
    { label: 'Revenue', value: '₹12.5L', icon: TrendingUp, color: '#F59E0B' },
  ];

  const quickActions = [
    {
      title: 'Manage Products',
      icon: Package,
      color: '#10B981',
      onPress: () => console.log('Manage Products'),
    },
    {
      title: 'Bulk Orders',
      icon: ShoppingCart,
      color: '#3B82F6',
      onPress: () => console.log('Bulk Orders'),
    },
    {
      title: 'Clinic Orders',
      icon: Building2,
      color: '#F59E0B',
      onPress: () => console.log('Clinic Orders'),
    },
    {
      title: 'Shipping',
      icon: Truck,
      color: '#4B2A99',
      onPress: () => console.log('Shipping'),
    },
  ];

  const recentOrders = [
    { id: '1', clinic: 'City Clinic', items: '500 packets', amount: '₹25K', status: 'processing' },
    { id: '2', clinic: 'Health Plus', items: '1000 packets', amount: '₹50K', status: 'shipped' },
  ];

  return (
    <ScreenWrapper
      title="Factory Dashboard"
      showBack={false}
      showProfile={true}
      scrollable={true}
    >
      {/* Header Stats */}
      <Animated.View entering={FadeInUp} style={styles.headerSection}>
        <View style={[styles.welcomeCard, { backgroundColor: theme.primary, ...shadows }]}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Welcome, Pharma Factory</Text>
            <Text style={styles.welcomeSubtitle}>Manage bulk medicine supply</Text>
          </View>
          <Factory size={48} color="#fff" opacity={0.3} />
        </View>
      </Animated.View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(index * 100)}
              style={[styles.statCard, { backgroundColor: theme.surface, ...shadows }]}
            >
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <Icon size={24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {stat.label}
              </Text>
            </Animated.View>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Animated.View
                key={action.title}
                entering={FadeInDown.delay(index * 100 + 400)}
              >
                <TouchableOpacity
                  style={[styles.actionCard, { backgroundColor: theme.surface, ...shadows }]}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                    <Icon size={28} color={action.color} />
                  </View>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Bulk Orders</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentOrders.map((order, index) => (
          <Animated.View
            key={order.id}
            entering={FadeInDown.delay(index * 100 + 800)}
          >
            <TouchableOpacity
              style={[styles.orderCard, { backgroundColor: theme.surface, ...shadows }]}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={[styles.orderClinic, { color: theme.text }]}>
                    {order.clinic}
                  </Text>
                  <Text style={[styles.orderItems, { color: theme.textSecondary }]}>
                    {order.items} • {order.amount}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: order.status === 'shipped' ? '#10B98120' : '#F59E0B20' }]}>
                  <Text style={[styles.statusText, { color: order.status === 'shipped' ? '#10B981' : '#F59E0B' }]}>
                    {order.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 24,
  },
  welcomeCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    margin: 8,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  actionCard: {
    width: '48%',
    margin: 8,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  orderCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderClinic: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});

export default FactoryDashboardScreen;
