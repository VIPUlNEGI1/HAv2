import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { ProductCard } from './components/ProductCard';
import { MultiImagePicker } from './components/MultiImagePicker';
import { Plus, Search, Filter } from 'lucide-react-native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Product {
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
}

const ClinicProductsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      brand: 'Dolo',
      price: 25,
      stock: 150,
      category: 'Pain Relief',
      weight: '15 Tablets',
      manufacturer: 'Micro Labs',
      licenseNumber: 'DL-2024-001',
      composition: 'Paracetamol IP 500mg',
      usage: 'Pain relief, Fever reduction',
      sideEffects: 'Nausea, Dizziness',
      images: [],
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      brand: 'Cipla',
      price: 45,
      stock: 80,
      category: 'Antibiotic',
      weight: '10 Capsules',
      manufacturer: 'Cipla Ltd',
      licenseNumber: 'DL-2024-002',
      composition: 'Amoxicillin Trihydrate 250mg',
      usage: 'Bacterial infections',
      sideEffects: 'Diarrhea, Nausea',
      images: [],
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: '',
    weight: '',
    manufacturer: '',
    licenseNumber: '',
    composition: '',
    usage: '',
    sideEffects: '',
    images: [] as string[],
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.weight) {
      toast.error('Please fill all required fields');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      brand: newProduct.brand,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      weight: newProduct.weight,
      manufacturer: newProduct.manufacturer || undefined,
      licenseNumber: newProduct.licenseNumber || undefined,
      composition: newProduct.composition || undefined,
      usage: newProduct.usage || undefined,
      sideEffects: newProduct.sideEffects || undefined,
      images: newProduct.images.length > 0 ? newProduct.images : undefined,
      image: newProduct.images.length > 0 ? newProduct.images[0] : undefined,
    };

    setProducts([...products, product]);
    setNewProduct({ 
      name: '', 
      brand: '', 
      price: '', 
      stock: '', 
      category: '', 
      weight: '',
      manufacturer: '',
      licenseNumber: '',
      composition: '',
      usage: '',
      sideEffects: '',
      images: [] 
    });
    setShowAddModal(false);
    toast.success('Product added successfully');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper title="Products" showBack={true} scrollable={false}>
      <View style={styles.container}>
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
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Filter size={moderateScale(20)} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Products List */}
        <ScrollView
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.map((product, index) => (
            <Animated.View key={product.id} entering={FadeInDown.delay(index * 50)}>
              <ProductCard
                product={product}
                onPress={() => {
                  try {
                    navigation.navigate('ClinicProductDetailsScreen', { product });
                  } catch (error) {
                    console.error('Navigation error:', error);
                    toast.error('Navigation failed');
                  }
                }}
                onEdit={() => {
                  try {
                    navigation.navigate('ClinicProductDetailsScreen', { product, editMode: true });
                  } catch (error) {
                    console.error('Navigation error:', error);
                    toast.error('Navigation failed');
                  }
                }}
                onDelete={() => handleDeleteProduct(product.id)}
              />
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
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: theme.surface, ...shadows }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Product</Text>

              {/* Multiple Images */}
              <MultiImagePicker
                images={newProduct.images}
                onImagesSelected={(uris) => setNewProduct({ ...newProduct, images: uris })}
                maxImages={4}
                label="Product Images (1-4)"
              />

              {/* Basic Info */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Product Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Paracetamol 500mg"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Brand *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Dolo, Cipla"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.brand}
                onChangeText={(text) => setNewProduct({ ...newProduct, brand: text })}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Category *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                    placeholder="e.g., Pain Relief"
                    placeholderTextColor={theme.textSecondary}
                    value={newProduct.category}
                    onChangeText={(text) => setNewProduct({ ...newProduct, category: text })}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Weight *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                    placeholder="e.g., 15 Tablets"
                    placeholderTextColor={theme.textSecondary}
                    value={newProduct.weight}
                    onChangeText={(text) => setNewProduct({ ...newProduct, weight: text })}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Price (₹) *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                    placeholder="0.00"
                    placeholderTextColor={theme.textSecondary}
                    value={newProduct.price}
                    onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>Stock *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                    placeholder="0"
                    placeholderTextColor={theme.textSecondary}
                    value={newProduct.stock}
                    onChangeText={(text) => setNewProduct({ ...newProduct, stock: text })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Additional Details */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Manufacturer</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Micro Labs"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.manufacturer}
                onChangeText={(text) => setNewProduct({ ...newProduct, manufacturer: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>License Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., DL-2024-001"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.licenseNumber}
                onChangeText={(text) => setNewProduct({ ...newProduct, licenseNumber: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Composition</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Paracetamol IP 500mg, Caffeine 30mg"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.composition}
                onChangeText={(text) => setNewProduct({ ...newProduct, composition: text })}
                multiline
                numberOfLines={2}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Usage</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Pain relief, Fever reduction, Headache"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.usage}
                onChangeText={(text) => setNewProduct({ ...newProduct, usage: text })}
                multiline
                numberOfLines={2}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Side Effects</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Nausea, Dizziness (Consult doctor if persistent)"
                placeholderTextColor={theme.textSecondary}
                value={newProduct.sideEffects}
                onChangeText={(text) => setNewProduct({ ...newProduct, sideEffects: text })}
                multiline
                numberOfLines={2}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
                  onPress={handleAddProduct}
                >
                  <Text style={styles.saveButtonText}>Add Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

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
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(16),
    margin: moderateScale(16),
    gap: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  filterButton: {
    padding: moderateScale(4),
  },
  productsList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
  addButton: {
    position: 'absolute',
    bottom: verticalScale(24),
    right: moderateScale(24),
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    marginBottom: verticalScale(6),
    marginTop: verticalScale(4),
  },
  input: {
    borderWidth: 1.5,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(14),
    marginBottom: verticalScale(12),
  },
  textArea: {
    minHeight: verticalScale(60),
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  halfInput: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: verticalScale(20),
  },
  modalButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  saveButton: {},
  modalButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});

export default ClinicProductsScreen;
