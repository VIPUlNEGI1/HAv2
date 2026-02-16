import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Truck, Package, MapPin, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Shipping } from '../hooks/useFactoryShipping';

interface ShippingCardProps {
  shipment: Shipping;
  onPress: () => void;
  getStatusColor: (status: string) => string;
  index?: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return CheckCircle2;
    case 'in_transit':
      return Truck;
    case 'shipped':
      return Truck;
    case 'ready':
      return Package;
    case 'preparing':
      return Clock;
    case 'cancelled':
      return XCircle;
    default:
      return Clock;
  }
};

export const ShippingCard: React.FC<ShippingCardProps> = ({
  shipment,
  onPress,
  getStatusColor,
  index = 0,
}) => {
  const { theme, shadows } = useTheme();
  const StatusIcon = getStatusIcon(shipment.status);
  const statusColor = getStatusColor(shipment.status);

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
              <Truck size={moderateScale(20)} color={theme.primary} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.orderNumber, { color: theme.text }]}>{shipment.orderNumber}</Text>
              <Text style={[styles.clientName, { color: theme.textSecondary }]} numberOfLines={1}>
                {shipment.clientName}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <StatusIcon size={moderateScale(12)} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {shipment.status.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <View style={[styles.details, { borderTopColor: theme.border }]}>
          <View style={styles.detailRow}>
            <Package size={moderateScale(14)} color={theme.textSecondary} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
              {shipment.items} items
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={moderateScale(14)} color={theme.textSecondary} />
            <Text style={[styles.detailText, { color: theme.textSecondary }]} numberOfLines={1}>
              {shipment.address}
            </Text>
          </View>
          {shipment.shippingDate && (
            <View style={styles.detailRow}>
              <Calendar size={moderateScale(14)} color={theme.textSecondary} />
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                Shipped: {shipment.shippingDate}
              </Text>
            </View>
          )}
          {shipment.estimatedDelivery && (
            <View style={styles.detailRow}>
              <Calendar size={moderateScale(14)} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.primary }]}>
                ETA: {shipment.estimatedDelivery}
              </Text>
            </View>
          )}
        </View>

        {shipment.trackingNumber && (
          <View style={[styles.tracking, { borderTopColor: theme.border }]}>
            <Text style={[styles.trackingLabel, { color: theme.textSecondary }]}>Tracking:</Text>
            <Text style={[styles.trackingNumber, { color: theme.primary }]}>{shipment.trackingNumber}</Text>
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
    minHeight: verticalScale(160),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
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
  orderNumber: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(4),
  },
  clientName: {
    fontSize: moderateScale(13),
    fontWeight: '600',
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
  details: {
    gap: verticalScale(8),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  detailText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    flex: 1,
  },
  tracking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
  },
  trackingLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  trackingNumber: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
