import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { SearchBar, FilterBar, EmptyState, FloatingActionButton } from '@/Components/common';
import { useClinicProducts } from './hooks/useClinicProducts';
import { ProductCard } from '../components/ProductCard';
import { AddProductModal } from './components/AddProductModal';
import { useNavigation } from '@react-navigation/native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { Plus, Package } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ClinicProductsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showAddModal,
    setShowAddModal,
    newProduct,
    setNewProduct,
    handleAddProduct,
    handleDeleteProduct,
    resetNewProduct,
    refreshing,
    handleRefresh,
  } = useClinicProducts();

  const handleProductPress = (product: any) => {
    try {
      navigation.navigate('ClinicProductDetailsScreen', { product });
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Navigation failed');
    }
  };

  const handleEdit = (product: any) => {
    try {
      navigation.navigate('ClinicProductDetailsScreen', { product, editMode: true });
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Navigation failed');
    }
  };

  return (
    <ScreenWrapper title="Products" showBack={true} scrollable={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            style={styles.searchBar}
          />
        </View>

        {/* Category Filter */}
        <FilterBar
          filters={categories}
          selectedFilter={selectedCategory}
          onFilterChange={setSelectedCategory}
          style={styles.filterBar}
        />

        {/* Products List */}
        <ScrollView
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
          }
        >
          {products.length === 0 ? (
            <EmptyState icon={Package} title="No Products Found" message="Add your first product to get started." />
          ) : (
            products.map((product, index) => (
              <Animated.View key={product.id} entering={FadeInDown.delay(index * 50)}>
                <ProductCard
                  product={product}
                  onPress={() => handleProductPress(product)}
                  onEdit={() => handleEdit(product)}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* Add Product Button */}
        <FloatingActionButton icon={Plus} onPress={() => setShowAddModal(true)} />
      </View>

      {/* Add Product Modal */}
      <AddProductModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetNewProduct();
        }}
        product={newProduct}
        onProductChange={setNewProduct}
        onSave={handleAddProduct}
      />

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(8),
  },
  searchBar: {
    marginHorizontal: 0,
  },
  filterBar: {
    paddingHorizontal: moderateScale(16),
  },
  productsList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
});

export default ClinicProductsScreen;
