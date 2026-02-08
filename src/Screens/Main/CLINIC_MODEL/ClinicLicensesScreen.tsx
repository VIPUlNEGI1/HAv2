import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { FileText, Upload, Download, Trash2, Plus } from 'lucide-react-native';
import { ImagePickerButton } from './components/ImagePickerButton';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface License {
  id: string;
  name: string;
  number: string;
  expiryDate: string;
  document?: string;
}

const ClinicLicensesScreen = () => {
  const { theme, shadows } = useTheme();
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      name: 'Clinic Registration',
      number: 'CL-2024-001',
      expiryDate: '2025-12-31',
    },
    {
      id: '2',
      name: 'Pharmacy License',
      number: 'PH-2024-045',
      expiryDate: '2025-06-30',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLicense, setNewLicense] = useState({
    name: '',
    number: '',
    expiryDate: '',
    document: '',
  });

  const handleAddLicense = () => {
    if (!newLicense.name || !newLicense.number || !newLicense.expiryDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const license: License = {
      id: Date.now().toString(),
      name: newLicense.name,
      number: newLicense.number,
      expiryDate: newLicense.expiryDate,
      document: newLicense.document || undefined,
    };

    setLicenses([...licenses, license]);
    setNewLicense({ name: '', number: '', expiryDate: '', document: '' });
    setShowAddModal(false);
    toast.success('License added successfully');
  };

  const handleDeleteLicense = (id: string) => {
    Alert.alert('Delete License', 'Are you sure you want to delete this license?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setLicenses(licenses.filter(l => l.id !== id));
          toast.success('License deleted');
        },
      },
    ]);
  };

  return (
    <ScreenWrapper title="Licenses & Documents" showBack={true} scrollable={false}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.licensesList}
          showsVerticalScrollIndicator={false}
        >
          {licenses.map((license, index) => (
            <Animated.View key={license.id} entering={FadeInDown.delay(index * 50)}>
              <View style={[styles.licenseCard, { backgroundColor: theme.surface, ...shadows }]}>
                <View style={styles.licenseHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                    <FileText size={moderateScale(24)} color={theme.primary} />
                  </View>
                  <View style={styles.licenseInfo}>
                    <Text style={[styles.licenseName, { color: theme.text }]}>{license.name}</Text>
                    <Text style={[styles.licenseNumber, { color: theme.textSecondary }]}>
                      {license.number}
                    </Text>
                    <Text style={[styles.expiryDate, { color: theme.textSecondary }]}>
                      Expires: {license.expiryDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.licenseActions}>
                  {license.document && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                      activeOpacity={0.7}
                    >
                      <Download size={moderateScale(16)} color={theme.primary} />
                      <Text style={[styles.actionText, { color: theme.primary }]}>View</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
                    onPress={() => handleDeleteLicense(license.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={moderateScale(16)} color="#EF4444" />
                    <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary, ...shadows }]}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Plus size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Add License Modal */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: theme.surface, ...shadows }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add New License</Text>

              <ImagePickerButton
                imageUri={newLicense.document}
                onImageSelected={(uri) => setNewLicense({ ...newLicense, document: uri })}
                onImageRemoved={() => setNewLicense({ ...newLicense, document: '' })}
                label="License Document"
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>License Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Clinic Registration"
                placeholderTextColor={theme.textSecondary}
                value={newLicense.name}
                onChangeText={(text) => setNewLicense({ ...newLicense, name: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>License Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., CL-2024-001"
                placeholderTextColor={theme.textSecondary}
                value={newLicense.number}
                onChangeText={(text) => setNewLicense({ ...newLicense, number: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Expiry Date</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
                value={newLicense.expiryDate}
                onChangeText={(text) => setNewLicense({ ...newLicense, expiryDate: text })}
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
                  onPress={handleAddLicense}
                >
                  <Text style={styles.saveButtonText}>Add License</Text>
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
  licensesList: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
  licenseCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  licenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  iconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  licenseInfo: {
    flex: 1,
  },
  licenseName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  licenseNumber: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  expiryDate: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  licenseActions: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  actionText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
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

export default ClinicLicensesScreen;
