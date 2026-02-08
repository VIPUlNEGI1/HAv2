import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const ClinicProfileScreen = () => {
  const { theme } = useTheme();

  return (
    <ScreenWrapper title="Clinic Profile" showBack={true} scrollable={true}>
      <View style={styles.container}>
        <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
          Clinic Profile Screen - Coming Soon
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  placeholder: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ClinicProfileScreen;
