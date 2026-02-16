import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import type { FactoryProfile } from '../hooks/useFactoryProfile';

interface ProfileInfoProps {
  profile: FactoryProfile;
}

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const { theme } = useTheme();

  const fields: { label: string; value: string }[] = [
    { label: 'Factory Name', value: profile.factoryName },
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
    { label: 'Address', value: profile.address },
    { label: 'License Number', value: profile.licenseNumber },
  ];

  return (
    <View style={styles.content}>
      {fields.map(({ label, value }) => (
        <View key={label}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
          <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
