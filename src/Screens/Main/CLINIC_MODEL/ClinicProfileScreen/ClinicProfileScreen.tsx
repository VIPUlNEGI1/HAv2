import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { useClinicProfile } from './hooks/useClinicProfile';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const ClinicProfileScreen = () => {
  const { theme } = useTheme();
  const { profile } = useClinicProfile();

  return (
    <ScreenWrapper title="Clinic Profile" showBack={true} scrollable={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Clinic Name</Text>
          <Text style={[styles.value, { color: theme.text }]}>{profile.clinicName}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
          <Text style={[styles.value, { color: theme.text }]}>{profile.email}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Phone</Text>
          <Text style={[styles.value, { color: theme.text }]}>{profile.phone}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Address</Text>
          <Text style={[styles.value, { color: theme.text }]}>{profile.address}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>License Number</Text>
          <Text style={[styles.value, { color: theme.text }]}>{profile.licenseNumber}</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: moderateScale(16),
  },
  label: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(4),
  },
  value: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
});

export default ClinicProfileScreen;
