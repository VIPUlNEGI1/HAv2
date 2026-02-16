import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard, Receipt, Share2 } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Payment } from '../hooks/useFactoryClientDetails';

interface PaymentsTabProps {
  payments: Payment[];
  onShareInvoice: (invoiceNumber: string) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments, onShareInvoice }) => {
  const { theme, shadows } = useTheme();

  return (
    <>
      {payments.map((payment, index) => (
        <Animated.View key={payment.id} entering={FadeInDown.delay(index * 50)}>
          <View style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.header}>
              <View style={[styles.icon, { backgroundColor: theme.primary + '20' }]}>
                <CreditCard size={moderateScale(20)} color={theme.primary} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.amount, { color: theme.text }]}>₹{payment.amount.toLocaleString()}</Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>{payment.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: payment.status === 'completed' ? '#10B98120' : '#F59E0B20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: payment.status === 'completed' ? '#10B981' : '#F59E0B' },
                  ]}
                >
                  {payment.status}
                </Text>
              </View>
            </View>
            <View style={styles.details}>
              <Text style={[styles.method, { color: theme.textSecondary }]}>
                {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)} Payment
              </Text>
              {payment.invoiceNumber && (
                <TouchableOpacity
                  style={styles.invoiceLink}
                  onPress={() => onShareInvoice(payment.invoiceNumber!)}
                >
                  <Receipt size={moderateScale(14)} color={theme.primary} />
                  <Text style={[styles.invoiceLinkText, { color: theme.primary }]}>
                    Invoice {payment.invoiceNumber}
                  </Text>
                  <Share2 size={moderateScale(14)} color={theme.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(120),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  icon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  amount: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(2),
  },
  date: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  details: {
    gap: verticalScale(6),
  },
  method: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  invoiceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginTop: verticalScale(4),
  },
  invoiceLinkText: {
    flex: 1,
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
});
