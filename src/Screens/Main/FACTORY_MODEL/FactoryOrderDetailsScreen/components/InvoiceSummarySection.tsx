import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Receipt } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface InvoiceSummarySectionProps {
  order: Order;
}

export const InvoiceSummarySection: React.FC<InvoiceSummarySectionProps> = ({ order }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(700)}>
      <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Receipt size={moderateScale(20)} color={theme.primary} />
            <Text style={[styles.title, { color: theme.text, marginLeft: moderateScale(8) }]}>Invoice Summary</Text>
          </View>
          {order.invoiceNumber && (
            <Text style={[styles.invoiceNumber, { color: theme.textSecondary }]}>#{order.invoiceNumber}</Text>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Subtotal:</Text>
            <Text style={[styles.value, { color: theme.text }]}>₹{order.totalAmount.toLocaleString()}</Text>
          </View>
          {order.tax > 0 && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Tax (12%):</Text>
              <Text style={[styles.value, { color: theme.text }]}>₹{order.tax.toLocaleString()}</Text>
            </View>
          )}
          {order.discount > 0 && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: '#10B981' }]}>Discount:</Text>
              <Text style={[styles.value, { color: '#10B981' }]}>-₹{order.discount.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>Total Amount:</Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>₹{order.finalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {order.invoiceDate && (
          <View style={styles.footer}>
            <Text style={[styles.date, { color: theme.textSecondary }]}>Invoice Date: {order.invoiceDate}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  invoiceNumber: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  details: {
    gap: verticalScale(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  value: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  totalRow: {
    marginTop: verticalScale(8),
    paddingTop: verticalScale(12),
    borderTopWidth: 2,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalLabel: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  totalValue: {
    fontSize: moderateScale(22),
    fontWeight: '900',
  },
  footer: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  date: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    textAlign: 'center',
  },
});
