import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Building2, Package, ChevronRight } from 'lucide-react-native';
import type { Factory } from '../hooks/useClinicFactories';

interface FactoryCardProps {
  factory: Factory;
  onPress: () => void;
}

export const FactoryCard = ({ factory, onPress }: FactoryCardProps) => {
  const { theme, shadows } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.factoryCard, { backgroundColor: theme.surface, ...shadows }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
        <Building2 size={moderateScale(28)} color={theme.primary} />
      </View>
      <View style={styles.factoryInfo}>
        <Text style={[styles.factoryName, { color: theme.text }]}>{factory.name}</Text>
        <Text style={[styles.factoryLocation, { color: theme.textSecondary }]}>
          {factory.location}
        </Text>
        <View style={styles.factoryMeta}>
          <View style={styles.metaItem}>
            <Package size={moderateScale(14)} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {factory.productsCount} products
            </Text>
          </View>
          <Text style={[styles.minOrder, { color: theme.primary }]}>
            Min: {factory.minOrder} units
          </Text>
        </View>
      </View>
      <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  factoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  iconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  factoryInfo: { flex: 1 },
  factoryName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  factoryLocation: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginBottom: verticalScale(8),
  },
  factoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  metaText: { fontSize: moderateScale(12), fontWeight: '500' },
  minOrder: { fontSize: moderateScale(12), fontWeight: '700' },
});
