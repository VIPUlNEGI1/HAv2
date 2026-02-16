import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Building2, Search } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFactoryProducts, type Factory } from './hooks/useFactoryProducts';
import { FactoryProductCard } from './components/FactoryProductCard';

const FactoryProductsScreen = () => {
  const { theme, shadows } = useTheme();
  const route = useRoute<any>();
  const factory: Factory = route.params?.factory ?? {
    id: '1',
    name: 'MediPharm Industries',
    location: 'Mumbai',
  };
  const [searchQuery, setSearchQuery] = useState('');

  const {
    products,
    allProducts,
    cart,
    totalUnits,
    handleAddToCart,
    handleUpdateQuantity,
  } = useFactoryProducts(factory, searchQuery);

  const onAddToCart = (product: (typeof products)[0]) => {
    const ok = handleAddToCart(product);
    if (ok) toast.success(`Added ${product.minOrder} units to cart`);
    else toast.error(`Only ${product.stock} units available`);
  };

  const onUpdateQty = (productId: string, delta: number) => {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;
    handleUpdateQuantity(productId, delta);
    const currentQty = cart[productId] || 0;
    const newQty = currentQty + delta;
    if (newQty > 0 && newQty < product.minOrder)
      toast.error(`Minimum order is ${product.minOrder} units`);
    else if (newQty > product.stock) toast.error(`Only ${product.stock} units available`);
  };

  return (
    <ScreenWrapper title={factory.name} showBack={true} scrollable={false}>
      <View style={styles.container}>
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
        <ScrollView
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        >
          {products.map((product, index) => (
            <Animated.View key={product.id} entering={FadeInDown.delay(index * 50)}>
              <FactoryProductCard
                product={product}
                quantity={cart[product.id] || 0}
                onAddToCart={() => onAddToCart(product)}
                onUpdateQuantity={(delta) => onUpdateQty(product.id, delta)}
              />
            </Animated.View>
          ))}
        </ScrollView>
        {totalUnits > 0 && (
          <View style={[styles.cartSummary, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.cartInfo}>
              <Text style={[styles.cartTitle, { color: theme.text }]}>Cart Summary</Text>
              <Text style={[styles.cartItems, { color: theme.textSecondary }]}>
                {totalUnits} units
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
  container: { flex: 1 },
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
  factoryDetails: { flex: 1 },
  factoryName: { fontSize: moderateScale(16), fontWeight: '700', marginBottom: verticalScale(2) },
  factoryLocation: { fontSize: moderateScale(13), fontWeight: '500' },
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
  searchInput: { flex: 1, fontSize: moderateScale(14), fontWeight: '500' },
  productsList: { padding: moderateScale(16), paddingBottom: verticalScale(100) },
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
  cartInfo: { flex: 1 },
  cartTitle: { fontSize: moderateScale(14), fontWeight: '700', marginBottom: verticalScale(2) },
  cartItems: { fontSize: moderateScale(12), fontWeight: '500' },
  checkoutButton: {
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  checkoutText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '700' },
});

export default FactoryProductsScreen;
