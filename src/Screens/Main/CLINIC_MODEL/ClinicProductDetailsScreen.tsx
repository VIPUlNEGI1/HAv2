import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, FlatList, Dimensions } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { MultiImagePicker } from './components/MultiImagePicker';
import { Edit, Save, X, Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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

const ClinicProductDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const product = route.params?.product as Product;
  const editMode = route.params?.editMode || false;
  
  const [isEditing, setIsEditing] = useState(editMode);
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  useEffect(() => {
    setIsEditing(editMode);
  }, [editMode]);

  const handleSave = () => {
    if (!editedProduct.name || !editedProduct.brand || !editedProduct.price || !editedProduct.stock || !editedProduct.category || !editedProduct.weight) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // In real app, save to backend/store
    setIsEditing(false);
    toast.success('Product updated successfully');
    navigation.goBack();
  };

  const handleDelete = () => {
    // In real app, delete from backend/store
    toast.success('Product deleted');
    navigation.goBack();
  };

  const displayImages = editedProduct.images && editedProduct.images.length > 0 
    ? editedProduct.images 
    : editedProduct.image 
      ? [editedProduct.image] 
      : [];

  return (
    <ScreenWrapper 
      title={isEditing ? "Edit Product" : "Product Details"} 
      showBack={true} 
      scrollable={false}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Carousel */}
          {displayImages.length > 0 ? (
            <View style={styles.carouselContainer}>
              <FlatList
                data={displayImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: item }} style={styles.mainImage} />
                  </View>
                )}
              />
              <View style={styles.imageIndicator}>
                <Text style={[styles.imageCount, { color: '#fff' }]}>
                  {displayImages.length} / 4
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.noImageContainer, { backgroundColor: theme.border }]}>
              <Text style={[styles.noImageText, { color: theme.textSecondary }]}>
                No images added
              </Text>
            </View>
          )}

          {/* Product Info Card */}
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            {isEditing ? (
              <>
                {/* Edit Mode */}
                <MultiImagePicker
                  images={editedProduct.images || []}
                  onImagesSelected={(uris) => setEditedProduct({ ...editedProduct, images: uris, image: uris[0] })}
                  maxImages={4}
                  label="Product Images (1-4)"
                />

                <Text style={[styles.inputLabel, { color: theme.text }]}>Product Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  placeholder="Product Name"
                  placeholderTextColor={theme.textSecondary}
                  value={editedProduct.name}
                  onChangeText={(text) => setEditedProduct({ ...editedProduct, name: text })}
                />

                <Text style={[styles.inputLabel, { color: theme.text }]}>Brand *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  placeholder="Brand"
                  placeholderTextColor={theme.textSecondary}
                  value={editedProduct.brand}
                  onChangeText={(text) => setEditedProduct({ ...editedProduct, brand: text })}
                />

                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Category *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                      placeholder="Category"
                      placeholderTextColor={theme.textSecondary}
                      value={editedProduct.category}
                      onChangeText={(text) => setEditedProduct({ ...editedProduct, category: text })}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Weight *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                      placeholder="Weight"
                      placeholderTextColor={theme.textSecondary}
                      value={editedProduct.weight}
                      onChangeText={(text) => setEditedProduct({ ...editedProduct, weight: text })}
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
                      value={editedProduct.price.toString()}
                      onChangeText={(text) => setEditedProduct({ ...editedProduct, price: parseFloat(text) || 0 })}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Stock *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                      placeholder="0"
                      placeholderTextColor={theme.textSecondary}
                      value={editedProduct.stock.toString()}
                      onChangeText={(text) => setEditedProduct({ ...editedProduct, stock: parseInt(text) || 0 })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={[styles.inputLabel, { color: theme.text }]}>Manufacturer</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  placeholder="Manufacturer"
                  placeholderTextColor={theme.textSecondary}
                  value={editedProduct.manufacturer || ''}
                  onChangeText={(text) => setEditedProduct({ ...editedProduct, manufacturer: text })}
                />

                <Text style={[styles.inputLabel, { color: theme.text }]}>License Number</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  placeholder="License Number"
                  placeholderTextColor={theme.textSecondary}
                  value={editedProduct.licenseNumber || ''}
                  onChangeText={(text) => setEditedProduct({ ...editedProduct, licenseNumber: text })}
                />

                <Text style={[styles.inputLabel, { color: theme.text }]}>Composition</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  placeholder="Composition"
                  placeholderTextColor={theme.textSecondary}
                  value={editedProduct.composition || ''}
                  onChangeText={(text) => setEditedProduct({ ...editedProduct, composition: text })}
                  multiline
                  numberOfLines={3}
                />

                <Text style={[styles.inputLabel, { color: theme.text }]}>Usage</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  placeholder="Usage"
                  placeholderTextColor={theme.textSecondary}
                  value={editedProduct.usage || ''}
                  onChangeText={(text) => setEditedProduct({ ...editedProduct, usage: text })}
                  multiline
                  numberOfLines={3}
                />

                <Text style={[styles.inputLabel, { color: theme.text }]}>Side Effects</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  placeholder="Side Effects"
                  placeholderTextColor={theme.textSecondary}
                  value={editedProduct.sideEffects || ''}
                  onChangeText={(text) => setEditedProduct({ ...editedProduct, sideEffects: text })}
                  multiline
                  numberOfLines={3}
                />

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton, { borderColor: theme.border }]}
                    onPress={() => setIsEditing(false)}
                  >
                    <X size={moderateScale(18)} color={theme.textSecondary} />
                    <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton, { backgroundColor: theme.primary }]}
                    onPress={handleSave}
                  >
                    <Save size={moderateScale(18)} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* View Mode */}
                <View style={styles.viewHeader}>
                  <View>
                    <Text style={[styles.brand, { color: theme.primary }]}>{editedProduct.brand}</Text>
                    <Text style={[styles.name, { color: theme.text }]}>{editedProduct.name}</Text>
                    <Text style={[styles.weight, { color: theme.textSecondary }]}>{editedProduct.weight}</Text>
                  </View>
                  <View style={styles.actionIcons}>
                    <TouchableOpacity
                      style={[styles.iconButton, { backgroundColor: theme.primary + '20' }]}
                      onPress={() => setIsEditing(true)}
                      activeOpacity={0.7}
                    >
                      <Edit size={moderateScale(20)} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.iconButton, { backgroundColor: '#EF444420' }]}
                      onPress={handleDelete}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={moderateScale(20)} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: theme.text }]}>₹{editedProduct.price.toLocaleString()}</Text>
                  <View style={[styles.stockBadge, { backgroundColor: editedProduct.stock > 0 ? '#10B98120' : '#EF444420' }]}>
                    <Text style={[styles.stockText, { color: editedProduct.stock > 0 ? '#10B981' : '#EF4444' }]}>
                      {editedProduct.stock} in stock
                    </Text>
                  </View>
                </View>

                {/* Product Details */}
                <View style={styles.detailsSection}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Product Details</Text>
                  
                  {editedProduct.category && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Category:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{editedProduct.category}</Text>
                    </View>
                  )}

                  {editedProduct.manufacturer && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Manufacturer:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{editedProduct.manufacturer}</Text>
                    </View>
                  )}

                  {editedProduct.licenseNumber && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>License Number:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{editedProduct.licenseNumber}</Text>
                    </View>
                  )}

                  {editedProduct.composition && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Composition:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{editedProduct.composition}</Text>
                    </View>
                  )}

                  {editedProduct.usage && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Usage:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{editedProduct.usage}</Text>
                    </View>
                  )}

                  {editedProduct.sideEffects && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Side Effects:</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{editedProduct.sideEffects}</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>

      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  carouselContainer: {
    height: verticalScale(300),
    position: 'relative',
  },
  imageWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  mainImage: {
    width: width * 0.8,
    height: verticalScale(300),
    resizeMode: 'contain',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: moderateScale(16),
    right: moderateScale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
  },
  imageCount: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  noImageContainer: {
    height: verticalScale(200),
    justifyContent: 'center',
    alignItems: 'center',
    margin: moderateScale(16),
    borderRadius: moderateScale(16),
  },
  noImageText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  infoCard: {
    margin: moderateScale(16),
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
  },
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
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  halfInput: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: verticalScale(20),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  saveButton: {},
  actionButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});

export default ClinicProductDetailsScreen;
