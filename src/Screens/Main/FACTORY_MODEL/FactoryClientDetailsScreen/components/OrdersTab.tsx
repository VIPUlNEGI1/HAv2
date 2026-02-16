import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Share2, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryClientDetails';

interface OrdersTabProps {
  orders: Order[];
  getStatusColor: (status: string) => string;
  onOrderPress: (orderId: string) => void;
  onShareInvoice: (invoiceNumber: string) => void;
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

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, getStatusColor, onOrderPress, onShareInvoice }) => {
  const { theme, shadows } = useTheme();

  return (
    <>
      {orders.map((order, index) => {
        const StatusIcon = getStatusIcon(order.status);
        const statusColor = getStatusColor(order.status);
        return (
          <Animated.View key={order.id} entering={FadeInDown.delay(index * 50)}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}
              onPress={() => onOrderPress(order.id)}
              activeOpacity={0.8}
            >
              <View style={styles.header}>
                <View>
                  <Text style={[styles.number, { color: theme.text }]}>{order.orderNumber}</Text>
                  <Text style={[styles.date, { color: theme.textSecondary }]}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                  <StatusIcon size={moderateScale(14)} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Items:</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{order.items}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Amount:</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>₹{order.amount.toLocaleString()}</Text>
                </View>
                {order.invoiceNumber && (
                  <View style={styles.invoiceRow}>
                    <FileText size={moderateScale(14)} color={theme.primary} />
                    <Text style={[styles.invoiceText, { color: theme.primary }]}>{order.invoiceNumber}</Text>
                    <TouchableOpacity
                      onPress={() => onShareInvoice(order.invoiceNumber!)}
                      style={styles.shareButton}
                    >
                      <Share2 size={moderateScale(14)} color={theme.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(140),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  number: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(4),
  },
  date: {
    fontSize: moderateScale(12),
    fontWeight: '500',
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
  details: {
    gap: verticalScale(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  detailValue: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  invoiceText: {
    flex: 1,
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  shareButton: {
    padding: moderateScale(4),
  },
});
