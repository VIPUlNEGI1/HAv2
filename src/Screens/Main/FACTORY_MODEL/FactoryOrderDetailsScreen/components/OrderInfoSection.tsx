import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock, Truck } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface OrderInfoSectionProps {
  order: Order;
}

export const OrderInfoSection: React.FC<OrderInfoSectionProps> = ({ order }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(200)}>
      <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
        <Text style={[styles.title, { color: theme.text }]}>Order Information</Text>

        <View style={styles.row}>
          <View style={styles.item}>
            <Calendar size={moderateScale(16)} color={theme.primary} />
            <View style={styles.content}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Order Date</Text>
              <Text style={[styles.value, { color: theme.text }]}>{order.date}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Clock size={moderateScale(16)} color={theme.primary} />
            <View style={styles.content}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Order Time</Text>
              <Text style={[styles.value, { color: theme.text }]}>{order.time}</Text>
            </View>
          </View>
        </View>

        {order.estimatedDelivery && (
          <View style={styles.row}>
            <View style={styles.item}>
              <Truck size={moderateScale(16)} color={theme.primary} />
              <View style={styles.content}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Estimated Delivery</Text>
                <Text style={[styles.value, { color: theme.text }]}>{order.estimatedDelivery}</Text>
              </View>
            </View>
          </View>
        )}
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
  row: {
    flexDirection: 'row',
    gap: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  value: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});
