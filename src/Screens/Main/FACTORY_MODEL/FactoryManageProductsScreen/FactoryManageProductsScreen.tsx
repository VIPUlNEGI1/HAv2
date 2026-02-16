import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Plus } from 'lucide-react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { SearchBar, FilterBar } from '@/Components/common';
import { useFactoryManageProducts } from './hooks/useFactoryManageProducts';
import { ProductCard } from './components/ProductCard';
import { AddProductModal } from './components/AddProductModal';
import { useNavigation } from '@react-navigation/native';
import { Toasts } from '@backpackapp-io/react-native-toast';

const FactoryManageProductsScreen = () => {
  const { theme, shadows } = useTheme();
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
    refreshing,
    handleRefresh,
  } = useFactoryManageProducts();

  const handleProductPress = (product: any) => {
    navigation.navigate('FactoryProductDetailsScreen', { product, editMode: false });
  };

  return (
    <ScreenWrapper title="Manage Products" showBack={true} scrollable={false}>
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
            <View style={styles.emptyContainer}>
              <View style={styles.emptyContent}>
                {/* Empty state can be added here */}
              </View>
            </View>
          ) : (
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
                index={index}
              />
            ))
          )}
        </ScrollView>

        {/* Add Product Button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary, ...shadows }]}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Plus size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Add Product Modal */}
      <AddProductModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewProduct({
            name: '',
            brand: '',
            category: '',
            price: 0,
            minOrder: 0,
            stock: 0,
            manufacturer: '',
            licenseNumber: '',
            composition: '',
            images: [],
          });
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyContent: {
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: verticalScale(30),
    right: moderateScale(20),
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default FactoryManageProductsScreen;
