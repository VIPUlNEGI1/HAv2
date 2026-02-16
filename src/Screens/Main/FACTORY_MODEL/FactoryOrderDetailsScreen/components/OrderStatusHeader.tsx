import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, XCircle, Package, Truck } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale, scale } from '@/Helpers/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface OrderStatusHeaderProps {
  order: Order;
  getStatusColor: (status: string) => string;
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

export const OrderStatusHeader: React.FC<OrderStatusHeaderProps> = ({ order, getStatusColor }) => {
  const { theme, shadows } = useTheme();
  const StatusIcon = getStatusIcon(order.status);
  const statusColor = getStatusColor(order.status);

  return (
    <Animated.View entering={FadeInDown.delay(100)}>
      <LinearGradient
        colors={[statusColor, statusColor + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, shadows]}
      >
        <View style={styles.padding}>
          <View style={styles.content}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <StatusIcon size={moderateScale(22)} color="#fff" />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>Order {order.status.toUpperCase()}</Text>
              <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            {order.type === 'bulk' && (
              <View style={styles.typeBadge}>
                <Package size={moderateScale(14)} color="#fff" />
                <Text style={styles.typeBadgeText}>BULK ORDER</Text>
              </View>
            )}
            {order.trackingNumber && (
              <View style={styles.trackingContainer}>
                <Truck size={moderateScale(16)} color="#fff" />
                <Text style={styles.trackingText}>Tracking: {order.trackingNumber}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(16),
  },
  padding: {
    padding: scale(10),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  iconBg: {
    width: moderateScale(54),
    height: moderateScale(54),
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    color: '#fff',
    marginBottom: verticalScale(4),
  },
  orderNumber: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    flexWrap: 'wrap',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  typeBadgeText: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
    alignSelf: 'flex-start',
  },
  trackingText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#fff',
  },
});
