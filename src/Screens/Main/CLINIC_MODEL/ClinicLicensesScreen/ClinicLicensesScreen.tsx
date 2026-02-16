import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { Plus } from 'lucide-react-native';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useClinicLicenses } from './hooks/useClinicLicenses';
import { LicenseCard } from './components/LicenseCard';
import { AddLicenseModal } from './components/AddLicenseModal';

const ClinicLicensesScreen = () => {
  const { theme, shadows } = useTheme();
  const {
    licenses,
    showAddModal,
    setShowAddModal,
    newLicense,
    setNewLicense,
    handleAddLicense,
    handleDeleteLicense,
    resetNewLicense,
  } = useClinicLicenses();

  const onAddSuccess = () => toast.success('License added successfully');
  const onAddError = (msg: string) => toast.error(msg);
  const onDeleteSuccess = () => toast.success('License deleted');

  const confirmDelete = (id: string) => {
    Alert.alert('Delete License', 'Are you sure you want to delete this license?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          handleDeleteLicense(id, () => {}, onDeleteSuccess),
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
              <LicenseCard
                license={license}
                onDelete={() => confirmDelete(license.id)}
              />
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
      <AddLicenseModal
        visible={showAddModal}
        newLicense={newLicense}
        onNewLicenseChange={setNewLicense}
        onClose={() => {
          setShowAddModal(false);
          resetNewLicense();
        }}
        onSave={() =>
          handleAddLicense(onAddSuccess, onAddError)
        }
      />
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  licensesList: {
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
});

export default ClinicLicensesScreen;
