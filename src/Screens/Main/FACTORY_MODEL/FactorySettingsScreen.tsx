import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';

const FactorySettingsScreen = () => {
  const { theme } = useTheme();

  return (
    <ScreenWrapper title="Factory Settings" showBack={true} scrollable={true}>
      <View style={styles.container}>
        <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
          Factory Settings Screen - Coming Soon
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
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FactorySettingsScreen;
