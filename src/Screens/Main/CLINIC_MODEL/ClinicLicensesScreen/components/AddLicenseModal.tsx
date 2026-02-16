import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { ImagePickerButton } from '../../components/ImagePickerButton';

interface NewLicenseForm {
  name: string;
  number: string;
  expiryDate: string;
  document: string;
}

interface AddLicenseModalProps {
  visible: boolean;
  newLicense: NewLicenseForm;
  onNewLicenseChange: (v: NewLicenseForm) => void;
  onClose: () => void;
  onSave: () => void;
}

export const AddLicenseModal = ({
  visible,
  newLicense,
  onNewLicenseChange,
  onClose,
  onSave,
}: AddLicenseModalProps) => {
  const { theme, shadows } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modal, { backgroundColor: theme.surface, ...shadows }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Add New License</Text>
          <ImagePickerButton
            imageUri={newLicense.document}
            onImageSelected={(uri) => onNewLicenseChange({ ...newLicense, document: uri })}
            onImageRemoved={() => onNewLicenseChange({ ...newLicense, document: '' })}
            label="License Document"
          />
          <Text style={[styles.inputLabel, { color: theme.text }]}>License Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="e.g., Clinic Registration"
            placeholderTextColor={theme.textSecondary}
            value={newLicense.name}
            onChangeText={(text) => onNewLicenseChange({ ...newLicense, name: text })}
          />
          <Text style={[styles.inputLabel, { color: theme.text }]}>License Number</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="e.g., CL-2024-001"
            placeholderTextColor={theme.textSecondary}
            value={newLicense.number}
            onChangeText={(text) => onNewLicenseChange({ ...newLicense, number: text })}
          />
          <Text style={[styles.inputLabel, { color: theme.text }]}>Expiry Date</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textSecondary}
            value={newLicense.expiryDate}
            onChangeText={(text) => onNewLicenseChange({ ...newLicense, expiryDate: text })}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>Add License</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(8),
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
  cancelButton: { borderWidth: 1.5 },
  saveButton: {},
  modalButtonText: { fontSize: moderateScale(14), fontWeight: '700' },
  saveButtonText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '700' },
});
