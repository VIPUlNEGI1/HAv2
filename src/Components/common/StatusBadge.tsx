import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface StatusBadgeProps {
  status: string;
  variant?: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'custom';
  customColor?: string;
  customBgColor?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'custom',
  customColor,
  customBgColor,
}) => {
  const getStatusColors = () => {
    if (customColor && customBgColor) {
      return { color: customColor, bgColor: customBgColor };
    }

    switch (variant) {
      case 'active':
        return { color: '#10B981', bgColor: '#10B98120' };
      case 'inactive':
        return { color: '#EF4444', bgColor: '#EF444420' };
      case 'pending':
        return { color: '#F59E0B', bgColor: '#F59E0B20' };
      case 'completed':
        return { color: '#10B981', bgColor: '#10B98120' };
      case 'cancelled':
        return { color: '#EF4444', bgColor: '#EF444420' };
      default:
        return { color: '#6B7280', bgColor: '#6B728020' };
    }
  };

  const { color, bgColor } = getStatusColors();

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
