import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { FactoryProduct } from '../hooks/useFactoryManageProducts';

interface ProductCardProps {
  product: FactoryProduct;
  onPress: () => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, index = 0 }) => {
  const { theme, shadows } = useTheme();

  const getStockColor = (stock: number) => {
    if (stock > 10000) return '#10B981';
    if (stock > 5000) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Package size={moderateScale(24)} color={theme.primary} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={[styles.brand, { color: theme.textSecondary }]} numberOfLines={1}>
              {product.brand}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryText, { color: theme.primary }]}>{product.category}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.details, { borderTopColor: theme.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Price:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>₹{product.price}/unit</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Min Order:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {product.minOrder.toLocaleString()} units
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Stock:</Text>
            <Text style={[styles.detailValue, { color: getStockColor(product.stock) }]}>
              {product.stock.toLocaleString()} units
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
  brand: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  details: {
    gap: verticalScale(6),
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
});
