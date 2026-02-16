import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, ChevronRight, ChevronLeft, Package } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { MultiImagePicker } from '../../components/MultiImagePicker';
import { FormInput, StepperFormContainer, type StepperFormStep } from '@/Components/common';
import type { ClinicProduct } from '../hooks/useClinicProducts';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: Partial<ClinicProduct> & {
    name: string;
    brand: string;
    price: string;
    stock: string;
    category: string;
    weight: string;
    manufacturer: string;
    licenseNumber: string;
    composition: string;
    usage: string;
    sideEffects: string;
    images: string[];
  };
  onProductChange: (product: any) => void;
  onSave: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  product,
  onProductChange,
  onSave,
}) => {
  const { theme, shadows } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const canGoNext = () => {
    if (currentStep === 0)
      return !!(
        product.name?.trim() &&
        product.brand?.trim() &&
        product.category?.trim() &&
        product.weight?.trim() &&
        product.price?.trim() &&
        product.stock?.trim()
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
            images={product.images}
            onImagesSelected={(uris) => onProductChange({ ...product, images: uris })}
            maxImages={4}
            label="Product Images (1-4)"
          />
          <FormInput
            variant="stepper"
            label="Product Name"
            placeholder="e.g., Paracetamol 500mg"
            value={product.name}
            onChangeText={(text) => onProductChange({ ...product, name: text })}
            required
          />
          <FormInput
            variant="stepper"
            label="Brand"
            placeholder="e.g., Dolo, Cipla"
            value={product.brand}
            onChangeText={(text) => onProductChange({ ...product, brand: text })}
            required
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                variant="stepper"
                label="Category"
                placeholder="e.g., Pain Relief"
                value={product.category}
                onChangeText={(text) => onProductChange({ ...product, category: text })}
                required
              />
            </View>
            <View style={styles.halfInput}>
              <FormInput
                variant="stepper"
                label="Weight"
                placeholder="e.g., 15 Tablets"
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
                value={product.price}
                onChangeText={(text) => onProductChange({ ...product, price: text })}
                keyboardType="numeric"
                required
              />
            </View>
            <View style={styles.halfInput}>
              <FormInput
                variant="stepper"
                label="Stock"
                placeholder="0"
                value={product.stock}
                onChangeText={(text) => onProductChange({ ...product, stock: text })}
                keyboardType="numeric"
                required
              />
            </View>
          </View>
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
            label="Manufacturer"
            placeholder="e.g., Micro Labs"
            value={product.manufacturer}
            onChangeText={(text) => onProductChange({ ...product, manufacturer: text })}
          />
          <FormInput
            variant="stepper"
            label="License Number"
            placeholder="e.g., DL-2024-001"
            value={product.licenseNumber}
            onChangeText={(text) => onProductChange({ ...product, licenseNumber: text })}
          />
          <FormInput
            variant="stepper"
            label="Composition"
            placeholder="e.g., Paracetamol IP 500mg"
            value={product.composition}
            onChangeText={(text) => onProductChange({ ...product, composition: text })}
            multiline
            numberOfLines={2}
          />
          <FormInput
            variant="stepper"
            label="Usage"
            placeholder="e.g., Pain relief, Fever reduction"
            value={product.usage}
            onChangeText={(text) => onProductChange({ ...product, usage: text })}
            multiline
            numberOfLines={2}
          />
          <FormInput
            variant="stepper"
            label="Side Effects"
            placeholder="e.g., Nausea, Dizziness"
            value={product.sideEffects}
            onChangeText={(text) => onProductChange({ ...product, sideEffects: text })}
            multiline
            numberOfLines={2}
          />
        </ScrollView>
      ),
    },
    {
      key: 'review',
      title: 'Review',
      subtitle: 'Add product',
      content: (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.stepScroll}>
          <View style={[styles.reviewCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.reviewRow}>
              <Package size={20} color={theme.primary} />
              <Text style={[styles.reviewTitle, { color: theme.text }]}>{product.name || '—'}</Text>
            </View>
            <Text style={[styles.reviewSub, { color: theme.textSecondary }]}>{product.brand} · {product.category}</Text>
          </View>
          <View style={[styles.reviewRowCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Price</Text>
            <Text style={[styles.reviewValue, { color: theme.primary }]}>₹{product.price || '0'}</Text>
          </View>
          <View style={[styles.reviewRowCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.reviewLabel, { color: theme.textSecondary }]}>Stock</Text>
            <Text style={[styles.reviewValue, { color: theme.text }]}>{product.stock || '0'} units</Text>
          </View>
        </ScrollView>
      ),
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Add New Product</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <X size={moderateScale(24)} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <StepperFormContainer
              steps={steps}
              currentStep={currentStep}
              transitionDirection="vertical"
            />
          </View>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <View style={styles.footerRow}>
              {currentStep > 0 ? (
                <TouchableOpacity
                  onPress={() => setCurrentStep((s) => s - 1)}
                  style={[styles.secondaryBtn, { borderColor: theme.border }]}
                >
                  <ChevronLeft size={20} color={theme.primary} />
                  <Text style={[styles.secondaryBtnText, { color: theme.primary }]}>Back</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.secondaryBtn} />
              )}
              <TouchableOpacity
                onPress={handleNext}
                disabled={currentStep === 0 && !canGoNext()}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: canGoNext() ? theme.primary : theme.border,
                    opacity: canGoNext() ? 1 : 0.7,
                  },
                ]}
              >
                {currentStep < 2 ? (
                  <>
                    <Text style={styles.primaryBtnText}>Next</Text>
                    <ChevronRight size={20} color="#fff" />
                  </>
                ) : (
                  <Text style={styles.primaryBtnText}>Add Product</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '92%',
    maxHeight: '88%',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(20),
    borderBottomWidth: 1,
  },
  title: { fontSize: moderateScale(20), fontWeight: '800' },
  closeButton: { padding: moderateScale(4) },
  body: { paddingHorizontal: moderateScale(20), flex: 1, minHeight: 0 },
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
  footer: { padding: moderateScale(20), borderTopWidth: 1 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
    minWidth: 100,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '800' },
  primaryBtn: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
