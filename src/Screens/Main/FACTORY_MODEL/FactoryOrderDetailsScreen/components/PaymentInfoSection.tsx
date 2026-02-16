import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface PaymentInfoSectionProps {
  order: Order;
  getStatusColor: (status: string) => string;
}

export const PaymentInfoSection: React.FC<PaymentInfoSectionProps> = ({ order, getStatusColor }) => {
  const { theme, shadows } = useTheme();
  const statusColor = getStatusColor(order.status);

  return (
    <Animated.View entering={FadeInDown.delay(600)}>
      <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
        <Text style={[styles.title, { color: theme.text }]}>Payment Information</Text>

        <View style={styles.card}>
          <View style={[styles.icon, { backgroundColor: theme.primary + '20' }]}>
            <CreditCard size={moderateScale(24)} color={theme.primary} />
          </View>
          <View style={styles.details}>
            <Text style={[styles.method, { color: theme.text }]}>
              {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)} Payment
            </Text>
            <Text style={[styles.status, { color: statusColor }]}>
              {order.status === 'completed' ? 'Paid' : order.status === 'pending' ? 'Pending' : 'Processing'}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(16),
  },
  icon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  method: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  status: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
});
