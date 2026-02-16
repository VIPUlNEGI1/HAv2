import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import type { Product } from '../hooks/useFactoryProductDetails';

interface ProductViewDetailsProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductViewDetails: React.FC<ProductViewDetailsProps> = ({ product, onEdit, onDelete }) => {
  const { theme } = useTheme();

  return (
    <View>
      <View style={styles.viewHeader}>
        <View>
          <Text style={[styles.brand, { color: theme.primary }]}>{product.brand}</Text>
          <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
          <Text style={[styles.weight, { color: theme.textSecondary }]}>{product.weight}</Text>
        </View>
        <View style={styles.actionIcons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.primary + '20' }]}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Edit size={moderateScale(20)} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: '#EF444420' }]}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={moderateScale(20)} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: theme.text }]}>₹{product.price.toLocaleString()}</Text>
        <View style={[styles.stockBadge, { backgroundColor: product.stock > 0 ? '#10B98120' : '#EF444420' }]}>
          <Text style={[styles.stockText, { color: product.stock > 0 ? '#10B981' : '#EF4444' }]}>
            {product.stock} in stock
          </Text>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.detailsSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Product Details</Text>

        {product.category && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Category:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{product.category}</Text>
          </View>
        )}

        {product.manufacturer && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Manufacturer:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{product.manufacturer}</Text>
          </View>
        )}

        {product.licenseNumber && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>License Number:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{product.licenseNumber}</Text>
          </View>
        )}

        {product.composition && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Composition:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{product.composition}</Text>
          </View>
        )}

        {product.usage && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Usage:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{product.usage}</Text>
          </View>
        )}

        {product.sideEffects && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Side Effects:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{product.sideEffects}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(16),
  },
  brand: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: verticalScale(4),
  },
  name: {
    fontSize: moderateScale(22),
    fontWeight: '900',
    marginBottom: verticalScale(4),
  },
  weight: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  iconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  price: {
    fontSize: moderateScale(28),
    fontWeight: '900',
  },
  stockBadge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  stockText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  detailsSection: {
    marginTop: verticalScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(16),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    flex: 1,
  },
  detailValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});
