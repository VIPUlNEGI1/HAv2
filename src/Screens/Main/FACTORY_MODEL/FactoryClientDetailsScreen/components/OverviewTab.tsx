import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone, Mail, MapPin, ShoppingCart, TrendingUp, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Client, Order } from '../hooks/useFactoryClientDetails';

interface OverviewTabProps {
  client: Client;
  getStatusColor: (status: string) => string;
  onSeeAllOrders: () => void;
  onOrderPress: (orderId: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'shipped':
      return Truck;
    case 'processing':
      return Clock;
    case 'pending':
      return Clock;
    case 'cancelled':
      return XCircle;
    default:
      return Clock;
  }
};

export const OverviewTab: React.FC<OverviewTabProps> = ({
  client,
  getStatusColor,
  onSeeAllOrders,
  onOrderPress,
}) => {
  const { theme, shadows } = useTheme();

  return (
    <>
      {/* Contact Info */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>
          {client.phone && (
            <View style={styles.contactRow}>
              <Phone size={moderateScale(16)} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{client.phone}</Text>
            </View>
          )}
          {client.email && (
            <View style={styles.contactRow}>
              <Mail size={moderateScale(16)} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{client.email}</Text>
            </View>
          )}
          {client.address && (
            <View style={styles.contactRow}>
              <MapPin size={moderateScale(16)} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{client.address}</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(300)}>
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ShoppingCart size={moderateScale(24)} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>{client.totalOrders}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Orders</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={moderateScale(24)} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>
                ₹{(client.totalSpent / 100000).toFixed(1)}L
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Spent</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Recent Orders */}
      <Animated.View entering={FadeInDown.delay(400)}>
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Orders</Text>
            <TouchableOpacity onPress={onSeeAllOrders}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {client.orders.slice(0, 3).map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColor = getStatusColor(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderRow}
                onPress={() => onOrderPress(order.id)}
              >
                <View style={styles.orderRowLeft}>
                  <Text style={[styles.orderNumber, { color: theme.text }]}>{order.orderNumber}</Text>
                  <Text style={[styles.orderDate, { color: theme.textSecondary }]}>{order.date}</Text>
                </View>
                <View style={styles.orderRowRight}>
                  <Text style={[styles.orderAmount, { color: theme.text }]}>
                    ₹{order.amount.toLocaleString()}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <StatusIcon size={moderateScale(12)} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  seeAll: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  contactText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: moderateScale(16),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  orderRowLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  orderDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  orderRowRight: {
    alignItems: 'flex-end',
    gap: verticalScale(4),
  },
  orderAmount: {
    fontSize: moderateScale(14),
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
