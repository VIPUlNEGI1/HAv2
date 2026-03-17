import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Constant } from '@/Helpers/Constant';
import { getHasSeenAppOnboarding } from '@/Helpers/AppStorage';
import AppOnboardingScreen from '@/Screens/Auth/AppOnboardingScreen';
import VerifyEmailScreen from '@/Screens/Auth/VerifyEmailScreen';
import RoleSelectionScreen from '@/Screens/Auth/RoleSelectionScreen';
import OnboardingScreen from '@/Screens/Auth/OnboardingScreen';
import StoryScreen from '@/Screens/Auth/StoryScreen';
import LoginScreen from '@/Screens/Auth/LoginScreen';
import OTPVerificationScreen from '@/Screens/Auth/OTPVerificationScreen';
import type { RootStackParamList } from '@/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function AuthNavigation() {
  const hasSeenAppOnboarding = getHasSeenAppOnboarding();

  return (
    <Stack.Navigator
      screenOptions={{
        ...Constant.navigationOptions,
        gestureEnabled: true,
      }}
      initialRouteName={hasSeenAppOnboarding ? 'VerifyEmailScreen' : 'AppOnboardingScreen'}
    >
      <Stack.Screen name="AppOnboardingScreen" component={AppOnboardingScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="StoryScreen" component={StoryScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
}
