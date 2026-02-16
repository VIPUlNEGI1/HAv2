import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface NotificationSettingsProps {
  orders: boolean;
  payments: boolean;
  shipping: boolean;
  onOrdersChange: (value: boolean) => void;
  onPaymentsChange: (value: boolean) => void;
  onShippingChange: (value: boolean) => void;
}

export const NotificationSettings = ({
  orders,
  payments,
  shipping,
  onOrdersChange,
  onPaymentsChange,
  onShippingChange,
}: NotificationSettingsProps) => {
  const { theme } = useTheme();

  const rows: { label: string; value: boolean; onValueChange: (v: boolean) => void }[] = [
    { label: 'Order Notifications', value: orders, onValueChange: onOrdersChange },
    { label: 'Payment Notifications', value: payments, onValueChange: onPaymentsChange },
    { label: 'Shipping Updates', value: shipping, onValueChange: onShippingChange },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
      {rows.map(({ label, value, onValueChange }) => (
        <View key={label} style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: moderateScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});
