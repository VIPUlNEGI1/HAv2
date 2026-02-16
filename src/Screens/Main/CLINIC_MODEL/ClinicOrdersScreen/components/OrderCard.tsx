import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart, Package, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { ClinicOrder } from '../hooks/useClinicOrders';

interface OrderCardProps {
  order: ClinicOrder;
  onPress: () => void;
  getStatusColor: (status: string) => string;
  index?: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
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

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, getStatusColor, index = 0 }) => {
  const { theme, shadows } = useTheme();
  const StatusIcon = getStatusIcon(order.status);
  const statusColor = getStatusColor(order.status);

  return (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.header}>
          <View style={styles.left}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              {order.type === 'bulk' ? (
                <Package size={moderateScale(20)} color={theme.primary} />
              ) : (
                <ShoppingCart size={moderateScale(20)} color={theme.primary} />
              )}
            </View>
            <View style={styles.info}>
              <Text style={[styles.customerName, { color: theme.text }]} numberOfLines={1}>
                {order.customerName}
              </Text>
              <Text style={[styles.details, { color: theme.textSecondary }]}>
                {order.items} items • {order.date}
              </Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={[styles.amount, { color: theme.primary }]}>₹{order.amount.toLocaleString()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <StatusIcon size={moderateScale(12)} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
            </View>
          </View>
        </View>
        {order.type === 'bulk' && (
          <View style={[styles.bulkBadge, { backgroundColor: theme.primary + '10' }]}>
            <Text style={[styles.bulkText, { color: theme.primary }]}>Bulk Order</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(100),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(12),
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  customerName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  details: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(8),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    gap: moderateScale(5),
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  bulkBadge: {
    marginTop: verticalScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
  },
  bulkText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
