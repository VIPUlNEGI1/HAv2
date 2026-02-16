import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useFactoryProductDetails } from './hooks/useFactoryProductDetails';
import { ProductImageCarousel } from './components/ProductImageCarousel';
import { ProductEditForm } from './components/ProductEditForm';
import { ProductViewDetails } from './components/ProductViewDetails';
import { Toasts } from '@backpackapp-io/react-native-toast';

const FactoryProductDetailsScreen = () => {
  const { theme, shadows } = useTheme();
  const {
    product,
    isEditing,
    displayImages,
    setIsEditing,
    setEditedProduct,
    handleSave,
    handleDelete,
    saving,
  } = useFactoryProductDetails();

  return (
    <ScreenWrapper
      title={isEditing ? 'Edit Factory Product' : 'Factory Product Details'}
      showBack={true}
      scrollable={false}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Image Carousel */}
          <ProductImageCarousel images={displayImages} />

          {/* Product Info Card */}
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            {isEditing ? (
              <ProductEditForm
                product={product}
                onProductChange={setEditedProduct}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                saving={saving}
              />
            ) : (
              <ProductViewDetails product={product} onEdit={() => setIsEditing(true)} onDelete={handleDelete} />
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
  infoCard: {
    margin: moderateScale(16),
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
  },
});

export default FactoryProductDetailsScreen;
