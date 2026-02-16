import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Building2, FileText, MapPin } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Order } from '../hooks/useFactoryOrderDetails';

interface CompanyInfoSectionProps {
  order: Order;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ order }) => {
  const { theme, shadows } = useTheme();

  if (!order.companyName) return null;

  return (
    <Animated.View entering={FadeInDown.delay(400)}>
      <View style={[styles.section, { backgroundColor: theme.surface, ...shadows }]}>
        <Text style={[styles.title, { color: theme.text }]}>Company Information</Text>

        <View style={styles.card}>
          <View style={[styles.icon, { backgroundColor: theme.primary + '20' }]}>
            <Building2 size={moderateScale(24)} color={theme.primary} />
          </View>
          <View style={styles.details}>
            <Text style={[styles.name, { color: theme.text }]}>{order.companyName}</Text>
            {order.companyLicense && (
              <View style={styles.row}>
                <FileText size={moderateScale(14)} color={theme.textSecondary} />
                <Text style={[styles.text, { color: theme.textSecondary }]}>License: {order.companyLicense}</Text>
              </View>
            )}
            {order.companyAddress && (
              <View style={styles.row}>
                <MapPin size={moderateScale(14)} color={theme.textSecondary} />
                <Text style={[styles.text, { color: theme.textSecondary }]} numberOfLines={2}>
                  {order.companyAddress}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    marginBottom: verticalScale(6),
  },
  text: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    flex: 1,
  },
});
