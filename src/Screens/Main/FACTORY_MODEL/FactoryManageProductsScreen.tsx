import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Package, Plus, Search, Filter, X, Save, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MultiImagePicker } from '../CLINIC_MODEL/components/MultiImagePicker';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  minOrder: number;
  stock: number;
  manufacturer: string;
  licenseNumber: string;
  composition: string;
  images?: string[];
}

const FactoryManageProductsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
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

  const categories = ['all', 'Tablets', 'Syrups', 'Injections', 'Capsules', 'Ointments'];

  const products: Product[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      brand: 'Dolo',
      category: 'Tablets',
      price: 25,
      minOrder: 1000,
      stock: 50000,
      manufacturer: 'Micro Labs',
      licenseNumber: 'DL-2024-001',
      composition: 'Paracetamol 500mg',
      images: [],
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      brand: 'Cipla',
      category: 'Capsules',
      price: 45,
      minOrder: 500,
      stock: 25000,
      manufacturer: 'Cipla Ltd',
      licenseNumber: 'DL-2024-002',
      composition: 'Amoxicillin Trihydrate 250mg',
      images: [],
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.category) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Product added successfully!');
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
  };

  return (
    <ScreenWrapper title="Manage Products" showBack={true} scrollable={false}>
      <View style={styles.container}>
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface, ...shadows }]}>
            <Search size={moderateScale(18)} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search products..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: theme.primary, ...shadows }]}
            activeOpacity={0.7}
          >
            <Filter size={moderateScale(18)} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category ? theme.primary : theme.surface,
                  borderColor: selectedCategory === category ? theme.primary : theme.border,
                  ...shadows,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category ? '#fff' : theme.textSecondary,
                    fontWeight: selectedCategory === category ? '700' : '600',
                  },
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products List */}
        <ScrollView
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.map((product, index) => (
            <Animated.View key={product.id} entering={FadeInDown.delay(index * 50)}>
              <TouchableOpacity
                style={[styles.productCard, { backgroundColor: theme.surface, ...shadows }]}
                activeOpacity={0.8}
                  onPress={() => navigation.navigate('FactoryProductDetailsScreen', { product, editMode: false })}
              >
                <View style={styles.productHeader}>
                  <View style={[styles.productIcon, { backgroundColor: theme.primary + '20' }]}>
                    <Package size={moderateScale(24)} color={theme.primary} />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
                    <Text style={[styles.productBrand, { color: theme.textSecondary }]}>
                      {product.brand}
                    </Text>
                    <Text style={[styles.productCategory, { color: theme.primary }]}>
                      {product.category}
                    </Text>
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
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {product.minOrder.toLocaleString()} units
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Stock:</Text>
                    <Text style={[styles.detailValue, { color: product.stock > 10000 ? '#10B981' : '#F59E0B' }]}>
                      {product.stock.toLocaleString()} units
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
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
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Product</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <X size={moderateScale(24)} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <MultiImagePicker
                maxImages={4}
                onImagesSelected={(images) => setNewProduct({ ...newProduct, images })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Product Name *"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Brand *"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.brand}
                onChangeText={(text) => setNewProduct({ ...newProduct, brand: text })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Category *"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.category}
                onChangeText={(text) => setNewProduct({ ...newProduct, category: text })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Price per unit"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={newProduct.price?.toString()}
                onChangeText={(text) => setNewProduct({ ...newProduct, price: parseFloat(text) || 0 })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Minimum Order Quantity"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={newProduct.minOrder?.toString()}
                onChangeText={(text) => setNewProduct({ ...newProduct, minOrder: parseInt(text) || 0 })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Stock Quantity"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={newProduct.stock?.toString()}
                onChangeText={(text) => setNewProduct({ ...newProduct, stock: parseInt(text) || 0 })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Manufacturer"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.manufacturer}
                onChangeText={(text) => setNewProduct({ ...newProduct, manufacturer: text })}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="License Number"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.licenseNumber}
                onChangeText={(text) => setNewProduct({ ...newProduct, licenseNumber: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                placeholder="Composition"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
                value={newProduct.composition}
                onChangeText={(text) => setNewProduct({ ...newProduct, composition: text })}
              />

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleAddProduct}
                activeOpacity={0.8}
              >
                <Save size={moderateScale(20)} color="#fff" />
                <Text style={styles.saveButtonText}>Add Product</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: moderateScale(16),
    gap: moderateScale(12),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(16),
    height: verticalScale(48),
    gap: moderateScale(12),
    minHeight: verticalScale(48),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  filterButton: {
    width: moderateScale(48),
    height: verticalScale(48),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(48),
  },
  categoryContainer: {
    marginBottom: verticalScale(12),
    marginTop: verticalScale(4),
  },
  categoryContent: {
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(8),
    paddingRight: moderateScale(16),
  },
  categoryChip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1.5,
    minHeight: verticalScale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    textAlign: 'center',
  },
  productsList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
  productCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(120),
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  productIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    marginBottom: verticalScale(4),
  },
  productBrand: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  productCategory: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  productDetails: {
    gap: verticalScale(6),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
  },
  closeButton: {
    padding: moderateScale(4),
  },
  modalBody: {
    padding: moderateScale(20),
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(14),
    marginBottom: verticalScale(12),
  },
  textArea: {
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(8),
    marginTop: verticalScale(8),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});

export default FactoryManageProductsScreen;
