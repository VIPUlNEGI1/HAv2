import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { PaymentMethodData } from '../hooks/useFactoryPayments';

interface EarningsBreakdownProps {
  paymentMethods: PaymentMethodData[];
  totalEarnings: number;
}

export const EarningsBreakdown: React.FC<EarningsBreakdownProps> = ({ paymentMethods, totalEarnings }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(600)}>
      <View style={[styles.container, { backgroundColor: theme.surface, ...shadows }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Earnings Breakdown</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>By payment method</Text>
          </View>
        </View>

        <View style={styles.breakdown}>
          {paymentMethods.map((method, index) => {
            const percentage = (method.amount / totalEarnings) * 100;
            const percentageNum = Math.round(percentage);
            return (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View style={styles.left}>
                    <View style={[styles.dot, { backgroundColor: method.color }]} />
                    <Text style={[styles.label, { color: theme.text }]} numberOfLines={1}>
                      {method.type}
                    </Text>
                  </View>
                  <View style={styles.right}>
                    <Text style={[styles.amount, { color: theme.text }]} numberOfLines={1}>
                      ₹{method.amount.toLocaleString()}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: method.color + '20' }]}>
                      <Text style={[styles.percentage, { color: method.color }]}>{percentageNum}%</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.progressBar, { backgroundColor: theme.border + '30' }]}>
                  <View style={[styles.progressFill, { backgroundColor: method.color, width: `${percentageNum}%` as any }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(2),
  },
  subtitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  breakdown: {
    gap: verticalScale(16),
  },
  item: {
    gap: verticalScale(8),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    flex: 1,
  },
  dot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  amount: {
    fontSize: moderateScale(15),
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  percentage: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  progressBar: {
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: moderateScale(4),
  },
});
