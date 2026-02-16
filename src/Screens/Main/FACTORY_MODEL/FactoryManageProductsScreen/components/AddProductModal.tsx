import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, Save } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { MultiImagePicker } from '@/Screens/Main/CLINIC_MODEL/components/MultiImagePicker';
import type { FactoryProduct } from '../hooks/useFactoryManageProducts';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: Partial<FactoryProduct>;
  onProductChange: (product: Partial<FactoryProduct>) => void;
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

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Add New Product</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <X size={moderateScale(24)} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <MultiImagePicker
              maxImages={4}
              onImagesSelected={(images) => onProductChange({ ...product, images })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Product Name *"
              placeholderTextColor={theme.textSecondary}
              value={product.name}
              onChangeText={(text) => onProductChange({ ...product, name: text })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Brand *"
              placeholderTextColor={theme.textSecondary}
              value={product.brand}
              onChangeText={(text) => onProductChange({ ...product, brand: text })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Category *"
              placeholderTextColor={theme.textSecondary}
              value={product.category}
              onChangeText={(text) => onProductChange({ ...product, category: text })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Price per unit"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={product.price?.toString()}
              onChangeText={(text) => onProductChange({ ...product, price: parseFloat(text) || 0 })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Minimum Order Quantity"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={product.minOrder?.toString()}
              onChangeText={(text) => onProductChange({ ...product, minOrder: parseInt(text) || 0 })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Stock Quantity"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={product.stock?.toString()}
              onChangeText={(text) => onProductChange({ ...product, stock: parseInt(text) || 0 })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Manufacturer"
              placeholderTextColor={theme.textSecondary}
              value={product.manufacturer}
              onChangeText={(text) => onProductChange({ ...product, manufacturer: text })}
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="License Number"
              placeholderTextColor={theme.textSecondary}
              value={product.licenseNumber}
              onChangeText={(text) => onProductChange({ ...product, licenseNumber: text })}
            />

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Composition"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              value={product.composition}
              onChangeText={(text) => onProductChange({ ...product, composition: text })}
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={onSave}
              activeOpacity={0.8}
            >
              <Save size={moderateScale(20)} color="#fff" />
              <Text style={styles.saveButtonText}>Add Product</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(20),
    borderBottomWidth: 1,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '800',
  },
  closeButton: {
    padding: moderateScale(4),
  },
  body: {
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
