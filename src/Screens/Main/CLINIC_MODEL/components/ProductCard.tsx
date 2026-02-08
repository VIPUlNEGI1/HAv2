import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Edit, Trash2, Package, Building2, FileText, Info } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    stock: number;
    images?: string[];
    image?: string;
    category: string;
    weight: string;
    manufacturer?: string;
    licenseNumber?: string;
    composition?: string;
    usage?: string;
    sideEffects?: string;
  };
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { theme, shadows } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, ...shadows }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.cardContent}
      >
        <View style={styles.imageContainer}>
          {(product.images && product.images.length > 0) || product.image ? (
            <Image 
              source={{ uri: (product.images && product.images[0]) || product.image }} 
              style={styles.image} 
            />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: theme.border }]}>
              <Package size={moderateScale(32)} color={theme.textSecondary} />
            </View>
          )}
          <View style={[styles.stockBadge, { backgroundColor: product.stock > 0 ? '#10B981' : '#EF4444' }]}>
            <Text style={styles.stockText}>{product.stock} left</Text>
          </View>
          {product.images && product.images.length > 1 && (
            <View style={[styles.imageCountBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.imageCountText}>+{product.images.length - 1}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.brandContainer}>
              <Text style={[styles.brand, { color: theme.primary }]} numberOfLines={1}>
                {product.brand || 'Generic'}
              </Text>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.categoryText, { color: theme.primary }]} numberOfLines={1}>
                {product.category}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          
          {product.weight && (
            <View style={styles.detailRow}>
              <Package size={moderateScale(12)} color={theme.textSecondary} />
              <Text style={[styles.weight, { color: theme.textSecondary }]} numberOfLines={1}>
                {product.weight}
              </Text>
            </View>
          )}

          {product.manufacturer && (
            <View style={styles.detailRow}>
              <Building2 size={moderateScale(12)} color={theme.textSecondary} />
              <Text style={[styles.detailText, { color: theme.textSecondary }]} numberOfLines={1}>
                {product.manufacturer}
              </Text>
            </View>
          )}

          {product.licenseNumber && (
            <View style={styles.detailRow}>
              <FileText size={moderateScale(12)} color={theme.textSecondary} />
              <Text style={[styles.detailText, { color: theme.textSecondary }]} numberOfLines={1}>
                {product.licenseNumber}
              </Text>
            </View>
          )}

          {product.composition && (
            <View style={styles.compositionContainer}>
              <Info size={moderateScale(12)} color={theme.textSecondary} />
              <Text style={[styles.compositionText, { color: theme.textSecondary }]} numberOfLines={2}>
                {product.composition}
              </Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.price, { color: theme.primary }]}>
                ₹{product.price.toLocaleString()}
              </Text>
              <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>per unit</Text>
            </View>
            <View style={[styles.stockIndicator, { backgroundColor: product.stock > 50 ? '#10B98120' : product.stock > 0 ? '#F59E0B20' : '#EF444420' }]}>
              <Text style={[styles.stockIndicatorText, { 
                color: product.stock > 50 ? '#10B981' : product.stock > 0 ? '#F59E0B' : '#EF4444' 
              }]}>
                {product.stock > 50 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Edit size={moderateScale(16)} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={moderateScale(16)} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(20),
    padding: moderateScale(12),
    marginBottom: verticalScale(12),
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: verticalScale(140),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(10),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockBadge: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  stockText: {
    color: '#fff',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: moderateScale(8),
    left: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  imageCountText: {
    color: '#fff',
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  content: {
    marginBottom: verticalScale(8),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  brandContainer: {
    flex: 1,
  },
  brand: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
  },
  categoryText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(20),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginBottom: verticalScale(4),
  },
  weight: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    flex: 1,
  },
  detailText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    flex: 1,
  },
  compositionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(6),
    marginTop: verticalScale(4),
    marginBottom: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  compositionText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    flex: 1,
    lineHeight: moderateScale(16),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  price: {
    fontSize: moderateScale(20),
    fontWeight: '900',
  },
  priceLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  stockIndicator: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  stockIndicatorText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: moderateScale(8),
    marginTop: verticalScale(4),
  },
  actionButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
