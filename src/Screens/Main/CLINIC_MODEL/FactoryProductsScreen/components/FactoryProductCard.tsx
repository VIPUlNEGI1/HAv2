import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Package, ShoppingCart } from 'lucide-react-native';
import type { FactoryProduct } from '../hooks/useFactoryProducts';

interface FactoryProductCardProps {
  product: FactoryProduct;
  quantity: number;
  onAddToCart: () => void;
  onUpdateQuantity: (delta: number) => void;
}

export const FactoryProductCard = ({
  product,
  quantity,
  onAddToCart,
  onUpdateQuantity,
}: FactoryProductCardProps) => {
  const { theme, shadows } = useTheme();
  const hasImage = (product.images && product.images.length > 0) || product.image;

  return (
    <View style={[styles.productCard, { backgroundColor: theme.surface, ...shadows }]}>
      <View style={styles.productHeader}>
        <View style={styles.productLeft}>
          {hasImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: (product.images && product.images[0]) || product.image }}
                style={styles.productImage}
              />
            </View>
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.border }]}>
              <Package size={moderateScale(24)} color={theme.textSecondary} />
            </View>
          )}
          <View style={styles.productInfo}>
            <Text style={[styles.productBrand, { color: theme.primary }]}>{product.brand}</Text>
            <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={[styles.productWeight, { color: theme.textSecondary }]}>
              {product.weight}
            </Text>
            <Text style={[styles.productCategory, { color: theme.textSecondary }]}>
              {product.category}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Price:</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>₹{product.price}/unit</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Min Order:</Text>
          <Text style={[styles.detailValue, { color: theme.primary }]}>
            {product.minOrder} units
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Stock:</Text>
          <Text
            style={[
              styles.detailValue,
              { color: product.stock > 100 ? '#10B981' : '#F59E0B' },
            ]}
          >
            {product.stock} units
          </Text>
        </View>
        {product.manufacturer && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Manufacturer:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]} numberOfLines={1}>
              {product.manufacturer}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.productActions}>
        {quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.qtyButton, { backgroundColor: theme.primary + '20' }]}
              onPress={() => onUpdateQuantity(-product.minOrder)}
              activeOpacity={0.7}
            >
              <Text style={[styles.qtyButtonText, { color: theme.primary }]}>
                -{product.minOrder}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.quantityText, { color: theme.text }]}>{quantity} units</Text>
            <TouchableOpacity
              style={[styles.qtyButton, { backgroundColor: theme.primary }]}
              onPress={() => onUpdateQuantity(product.minOrder)}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyButtonTextWhite}>+{product.minOrder}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={onAddToCart}
            activeOpacity={0.8}
          >
            <ShoppingCart size={moderateScale(18)} color="#fff" />
            <Text style={styles.addButtonText}>Add {product.minOrder} units</Text>
          </TouchableOpacity>
        )}
        <View style={styles.totalPrice}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total:</Text>
          <Text style={[styles.totalValue, { color: theme.primary }]}>
            ₹{(quantity * product.price).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  productHeader: { marginBottom: verticalScale(12) },
  productLeft: { flexDirection: 'row', gap: moderateScale(12) },
  imageContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: { flex: 1 },
  productBrand: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: verticalScale(2),
  },
  productName: { fontSize: moderateScale(15), fontWeight: '700', marginBottom: verticalScale(4) },
  productWeight: { fontSize: moderateScale(12), fontWeight: '500', marginBottom: verticalScale(2) },
  productCategory: { fontSize: moderateScale(11), fontWeight: '500' },
  productDetails: {
    gap: verticalScale(6),
    marginBottom: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: moderateScale(12), fontWeight: '600' },
  detailValue: { fontSize: moderateScale(13), fontWeight: '700', flex: 1, textAlign: 'right' },
  productActions: { gap: verticalScale(8) },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  addButtonText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '700' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
  },
  qtyButton: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
    minWidth: moderateScale(60),
    alignItems: 'center',
  },
  qtyButtonText: { fontSize: moderateScale(12), fontWeight: '700' },
  qtyButtonTextWhite: { color: '#fff', fontSize: moderateScale(12), fontWeight: '700' },
  quantityText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  totalLabel: { fontSize: moderateScale(13), fontWeight: '600' },
  totalValue: { fontSize: moderateScale(16), fontWeight: '800' },
});
