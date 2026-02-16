import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface OrderItemsSectionProps {
  order: Order;
}

export const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({ order }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(500)}>
      <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
        <Text style={[styles.title, { color: theme.text }]}>Order Items</Text>

        {order.items.map((item, index) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.left}>
              <View style={[styles.number, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.numberText, { color: theme.primary }]}>{index + 1}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.brand, { color: theme.textSecondary }]}>{item.brand}</Text>
                <Text style={[styles.quantity, { color: theme.textSecondary }]}>
                  Qty: {item.quantity} × ₹{item.price}
                </Text>
              </View>
            </View>
            <Text style={[styles.total, { color: theme.text }]}>₹{item.total.toLocaleString()}</Text>
          </View>
        ))}
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: moderateScale(12),
  },
  number: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: moderateScale(14),
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  brand: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  quantity: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  total: {
    fontSize: moderateScale(16),
    fontWeight: '800',
  },
});
