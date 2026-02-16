import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Save, X, ChevronLeft, ChevronRight, Package } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { MultiImagePicker } from '../../../CLINIC_MODEL/components/MultiImagePicker';
import { FormInput, StepperFormContainer, type StepperFormStep } from '@/Components/common';
import type { Product } from '../hooks/useFactoryProductDetails';

interface ProductEditFormProps {
  product: Product;
  onProductChange: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  onProductChange,
  onSave,
  onCancel,
  saving = false,
}) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const canGoNext = () => {
    if (currentStep === 0)
      return !!(
        product.name?.trim() &&
        product.brand?.trim() &&
        product.category?.trim() &&
        product.weight?.trim() &&
        product.price > 0
      );
    return true;
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep((s) => s + 1);
    else onSave();
  };

  const steps: StepperFormStep[] = [
    {
      key: 'basic',
      title: 'Basic Info',
      subtitle: 'Name, price, stock',
      content: (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
          <MultiImagePicker
            images={product.images || []}
            onImagesSelected={(uris) => onProductChange({ ...product, images: uris, image: uris[0] })}
            maxImages={4}
            label="Product Images (1-4)"
          />
          <FormInput
            variant="stepper"
            label="Product Name"
            placeholder="Product Name"
            value={product.name}
            onChangeText={(text) => onProductChange({ ...product, name: text })}
            required
          />
          <FormInput
            variant="stepper"
            label="Brand"
            placeholder="Brand"
            value={product.brand}
            onChangeText={(text) => onProductChange({ ...product, brand: text })}
            required
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                variant="stepper"
                label="Category"
                placeholder="Category"
                value={product.category}
                onChangeText={(text) => onProductChange({ ...product, category: text })}
                required
              />
            </View>
            <View style={styles.halfInput}>
              <FormInput
                variant="stepper"
                label="Weight"
                placeholder="Weight"
                value={product.weight}
                onChangeText={(text) => onProductChange({ ...product, weight: text })}
                required
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                variant="stepper"
                label="Price (₹)"
                placeholder="0.00"
                value={product.price.toString()}
                onChangeText={(text) => onProductChange({ ...product, price: parseFloat(text) || 0 })}
                keyboardType="numeric"
                required
              />
            </View>
            <View style={styles.halfInput}>
              <FormInput
                variant="stepper"
                label="Stock"
                placeholder="0"
                value={product.stock.toString()}
                onChangeText={(text) => onProductChange({ ...product, stock: parseInt(text) || 0 })}
                keyboardType="numeric"
                required
              />
            </View>
          </View>
          <FormInput
            variant="stepper"
            label="Manufacturer"
            placeholder="Manufacturer"
            value={product.manufacturer || ''}
            onChangeText={(text) => onProductChange({ ...product, manufacturer: text })}
          />
          <FormInput
            variant="stepper"
            label="License Number"
            placeholder="License Number"
            value={product.licenseNumber || ''}
            onChangeText={(text) => onProductChange({ ...product, licenseNumber: text })}
          />
        </ScrollView>
      ),
    },
    {
      key: 'details',
      title: 'Details',
      subtitle: 'Composition & usage',
      content: (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
          <FormInput
            variant="stepper"
            label="Composition"
            placeholder="Composition"
            value={product.composition || ''}
            onChangeText={(text) => onProductChange({ ...product, composition: text })}
            multiline
            numberOfLines={3}
          />
          <FormInput
            variant="stepper"
            label="Usage"
            placeholder="Usage"
            value={product.usage || ''}
            onChangeText={(text) => onProductChange({ ...product, usage: text })}
            multiline
            numberOfLines={3}
          />
          <FormInput
            variant="stepper"
            label="Side Effects"
            placeholder="Side Effects"
            value={product.sideEffects || ''}
            onChangeText={(text) => onProductChange({ ...product, sideEffects: text })}
            multiline
            numberOfLines={3}
          />
        </ScrollView>
      ),
    },
    {
      key: 'review',
      title: 'Review',
      subtitle: 'Save changes',
      content: (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
          <View style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.reviewRow}>
              <Package size={20} color={theme.primary} />
              <Text style={[styles.reviewTitle, { color: theme.text }]}>{product.name}</Text>
            </View>
            <Text style={[styles.reviewSub, { color: theme.textSecondary }]}>
              {product.brand} · {product.category} · ₹{product.price}
            </Text>
          </View>
          <View style={[styles.reviewRowCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Stock</Text>
            <Text style={[styles.reviewValue, { color: theme.text }]}>{product.stock} units</Text>
          </View>
        </ScrollView>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <StepperFormContainer
        steps={steps}
        currentStep={currentStep}
        transitionDirection="vertical"
      />
      <View style={[styles.actionButtons, { borderTopColor: theme.border }]}>
        <View style={styles.actionRow}>
          {currentStep > 0 ? (
            <TouchableOpacity
              onPress={() => setCurrentStep((s) => s - 1)}
              style={[styles.actionButton, styles.cancelButton, { borderColor: theme.border }]}
            >
              <ChevronLeft size={18} color={theme.primary} />
              <Text style={[styles.actionButtonText, { color: theme.primary }]}>Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.actionButton, styles.cancelButton, { borderColor: theme.border }]}
            >
              <X size={18} color={theme.textSecondary} />
              <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            disabled={(currentStep === 0 && !canGoNext()) || saving}
            style={[
              styles.actionButton,
              styles.saveButton,
              {
                backgroundColor: canGoNext() ? theme.primary : theme.border,
                opacity: saving ? 0.7 : canGoNext() ? 1 : 0.7,
              },
            ]}
          >
            {currentStep < 2 ? (
              <>
                <Text style={styles.saveButtonText}>Next</Text>
                <ChevronRight size={18} color="#fff" />
              </>
            ) : (
              <>
                <Save size={18} color="#fff" />
                <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  stepScroll: { flex: 1, paddingBottom: 16 },
  row: { flexDirection: 'row', gap: moderateScale(12) },
  halfInput: { flex: 1 },
  reviewCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewTitle: { fontSize: 16, fontWeight: '800', flex: 1 },
  reviewSub: { fontSize: 13, marginTop: 4 },
  reviewRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  reviewLabel: { fontSize: 13, fontWeight: '600' },
  reviewValue: { fontSize: 15, fontWeight: '800' },
  actionButtons: {
    marginTop: verticalScale(20),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
  },
  actionRow: { flexDirection: 'row', gap: moderateScale(12) },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  cancelButton: { borderWidth: 1.5 },
  saveButton: {},
  actionButtonText: { fontSize: moderateScale(14), fontWeight: '700' },
  saveButtonText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '700' },
});
