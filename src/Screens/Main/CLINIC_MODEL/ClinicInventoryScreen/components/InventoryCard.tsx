import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Package, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { StatusBadge } from '@/Components/common';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { InventoryItem } from '../hooks/useClinicInventory';

interface InventoryCardProps {
  item: InventoryItem;
  getStatusColor: (status: string) => string;
  index?: number;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, getStatusColor, index = 0 }) => {
  const { theme, shadows } = useTheme();
  const statusColor = getStatusColor(item.status);
  const isLowStock = item.stock < item.minStock;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <View style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Package size={moderateScale(24)} color={theme.primary} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.category, { color: theme.textSecondary }]}>{item.category}</Text>
          </View>
          <StatusBadge
            status={item.status.replace('_', ' ')}
            variant={
              item.status === 'in_stock'
                ? 'active'
                : item.status === 'low_stock'
                ? 'pending'
                : 'inactive'
            }
          />
        </View>

        <View style={[styles.details, { borderTopColor: theme.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Stock:</Text>
            <Text style={[styles.detailValue, { color: statusColor }]}>
              {item.stock} {item.unit}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Min Stock:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {item.minStock} {item.unit}
            </Text>
          </View>
          {isLowStock && (
            <View style={[styles.alertContainer, { backgroundColor: '#F59E0B20' }]}>
              <AlertCircle size={moderateScale(14)} color="#F59E0B" />
              <Text style={[styles.alertText, { color: '#F59E0B' }]}>
                Stock is below minimum level
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
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
  iconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(4),
  },
  category: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  details: {
    gap: verticalScale(8),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  detailValue: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(4),
  },
  alertText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    flex: 1,
  },
});
