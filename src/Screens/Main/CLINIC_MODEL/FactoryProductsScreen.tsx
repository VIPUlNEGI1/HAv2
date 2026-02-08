import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Building2, Package, Search, ShoppingCart, Plus } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';

interface FactoryProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  minOrder: number;
  images?: string[];
  image?: string;
  category: string;
  weight: string;
  manufacturer: string;
  licenseNumber: string;
  composition?: string;
  usage?: string;
  stock: number;
}

const FactoryProductsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const factory = route.params?.factory || { id: '1', name: 'MediPharm Industries', location: 'Mumbai' };
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const products: FactoryProduct[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      brand: 'Dolo',
      price: 20,
      minOrder: 100,
      category: 'Pain Relief',
      weight: '15 Tablets',
      manufacturer: 'Micro Labs',
      licenseNumber: 'DL-2024-001',
      composition: 'Paracetamol IP 500mg',
      usage: 'Pain relief, Fever reduction',
      stock: 5000,
      images: [],
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      brand: 'Cipla',
      price: 35,
      minOrder: 50,
      category: 'Antibiotic',
      weight: '10 Capsules',
      manufacturer: 'Cipla Ltd',
      licenseNumber: 'DL-2024-002',
      composition: 'Amoxicillin Trihydrate 250mg',
      usage: 'Bacterial infections',
      stock: 3000,
      images: [],
    },
    {
      id: '3',
      name: 'Vitamin C 500mg',
      brand: 'Limcee',
      price: 30,
      minOrder: 200,
      category: 'Vitamins',
      weight: '15 Tablets',
      manufacturer: 'Abbott',
      licenseNumber: 'DL-2024-003',
      stock: 8000,
      images: [],
    },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: FactoryProduct) => {
    const currentQty = cart[product.id] || 0;
    if (currentQty + product.minOrder > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }
    setCart({ ...cart, [product.id]: (currentQty || 0) + product.minOrder });
    toast.success(`Added ${product.minOrder} units to cart`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const currentQty = cart[productId] || 0;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQty = Math.max(0, currentQty + delta);
    if (newQty > product.stock) {
      toast.error(`Only ${product.stock} units available`);
      return;
    }
    if (newQty > 0 && newQty < product.minOrder) {
      toast.error(`Minimum order is ${product.minOrder} units`);
      return;
    }
    setCart({ ...cart, [productId]: newQty });
  };

  return (
    <ScreenWrapper title={factory.name} showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Factory Info */}
        <View style={[styles.factoryInfoCard, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={[styles.factoryIcon, { backgroundColor: theme.primary + '20' }]}>
            <Building2 size={moderateScale(24)} color={theme.primary} />
          </View>
          <View style={styles.factoryDetails}>
            <Text style={[styles.factoryName, { color: theme.text }]}>{factory.name}</Text>
            <Text style={[styles.factoryLocation, { color: theme.textSecondary }]}>
              {factory.location}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.surface, ...shadows }]}>
          <Search size={moderateScale(20)} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search products..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Products List */}
        <ScrollView
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.map((product, index) => {
            const quantity = cart[product.id] || 0;
            return (
              <Animated.View key={product.id} entering={FadeInDown.delay(index * 50)}>
                <View style={[styles.productCard, { backgroundColor: theme.surface, ...shadows }]}>
                  <View style={styles.productHeader}>
                    <View style={styles.productLeft}>
                      {(product.images && product.images.length > 0) || product.image ? (
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
                      <Text style={[styles.detailValue, { color: theme.text }]}>
                        ₹{product.price}/unit
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Min Order:</Text>
                      <Text style={[styles.detailValue, { color: theme.primary }]}>
                        {product.minOrder} units
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Stock:</Text>
                      <Text style={[styles.detailValue, { color: product.stock > 100 ? '#10B981' : '#F59E0B' }]}>
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
                    {product.licenseNumber && (
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>License:</Text>
                        <Text style={[styles.detailValue, { color: theme.text }]}>
                          {product.licenseNumber}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.productActions}>
                    {quantity > 0 ? (
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={[styles.qtyButton, { backgroundColor: theme.primary + '20' }]}
                          onPress={() => handleUpdateQuantity(product.id, -product.minOrder)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.qtyButtonText, { color: theme.primary }]}>-{product.minOrder}</Text>
                        </TouchableOpacity>
                        <Text style={[styles.quantityText, { color: theme.text }]}>
                          {quantity} units
                        </Text>
                        <TouchableOpacity
                          style={[styles.qtyButton, { backgroundColor: theme.primary }]}
                          onPress={() => handleUpdateQuantity(product.id, product.minOrder)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.qtyButtonTextWhite}>+{product.minOrder}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: theme.primary }]}
                        onPress={() => handleAddToCart(product)}
                        activeOpacity={0.8}
                      >
                        <ShoppingCart size={moderateScale(18)} color="#fff" />
                        <Text style={styles.addButtonText}>
                          Add {product.minOrder} units
                        </Text>
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
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Cart Summary */}
        {Object.keys(cart).length > 0 && (
          <View style={[styles.cartSummary, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.cartInfo}>
              <Text style={[styles.cartTitle, { color: theme.text }]}>Cart Summary</Text>
              <Text style={[styles.cartItems, { color: theme.textSecondary }]}>
                {Object.values(cart).reduce((sum, qty) => sum + qty, 0)} units
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
              onPress={() => toast.success('Order placed successfully!')}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  factoryInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    margin: moderateScale(16),
    gap: moderateScale(12),
  },
  factoryIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  factoryDetails: {
    flex: 1,
  },
  factoryName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  factoryLocation: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(16),
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  productsList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
  productCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  productHeader: {
    marginBottom: verticalScale(12),
  },
  productLeft: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  imageContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: verticalScale(2),
  },
  productName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  productWeight: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginBottom: verticalScale(2),
  },
  productCategory: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  productDetails: {
    gap: verticalScale(6),
    marginBottom: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
    flex: 1,
    textAlign: 'right',
  },
  productActions: {
    gap: verticalScale(8),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  addButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
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
  qtyButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  qtyButtonTextWhite: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
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
  totalLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  totalValue: {
    fontSize: moderateScale(16),
    fontWeight: '800',
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(16),
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    gap: moderateScale(12),
  },
  cartInfo: {
    flex: 1,
  },
  cartTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  cartItems: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  checkoutButton: {
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  checkoutText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});

export default FactoryProductsScreen;
