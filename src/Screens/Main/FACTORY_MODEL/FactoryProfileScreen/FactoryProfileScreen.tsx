import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { useFactoryProfile } from './hooks/useFactoryProfile';
import { ProfileInfo } from './components/ProfileInfo';

const FactoryProfileScreen = () => {
  const { theme } = useTheme();
  const { profile } = useFactoryProfile();

  return (
    <ScreenWrapper title="Factory Profile" showBack={true} scrollable={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <ProfileInfo profile={profile} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FactoryProfileScreen;
