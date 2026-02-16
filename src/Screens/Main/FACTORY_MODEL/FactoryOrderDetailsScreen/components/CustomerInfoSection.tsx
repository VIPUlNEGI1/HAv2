import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User, Phone, Mail, MapPin } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface CustomerInfoSectionProps {
  order: Order;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({ order }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(300)}>
      <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
        <Text style={[styles.title, { color: theme.text }]}>Customer Information</Text>

        <View style={styles.card}>
          <View style={[styles.icon, { backgroundColor: theme.primary + '20' }]}>
            <User size={moderateScale(24)} color={theme.primary} />
          </View>
          <View style={styles.details}>
            <Text style={[styles.name, { color: theme.text }]}>{order.customerName}</Text>
            {order.customerPhone && (
              <View style={styles.contactRow}>
                <Phone size={moderateScale(14)} color={theme.textSecondary} />
                <Text style={[styles.contactText, { color: theme.textSecondary }]}>{order.customerPhone}</Text>
              </View>
            )}
            {order.customerEmail && (
              <View style={styles.contactRow}>
                <Mail size={moderateScale(14)} color={theme.textSecondary} />
                <Text style={[styles.contactText, { color: theme.textSecondary }]}>{order.customerEmail}</Text>
              </View>
            )}
            {order.customerAddress && (
              <View style={styles.contactRow}>
                <MapPin size={moderateScale(14)} color={theme.textSecondary} />
                <Text style={[styles.contactText, { color: theme.textSecondary }]} numberOfLines={2}>
                  {order.customerAddress}
                </Text>
              </View>
            )}
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
  name: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    marginBottom: verticalScale(6),
  },
  contactText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    flex: 1,
  },
});
