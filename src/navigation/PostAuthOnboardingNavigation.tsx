import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Constant } from '@/Helpers/Constant';
import { getPendingAuth } from '@/Helpers/AppStorage';
import RoleSelectionScreen from '@/Screens/Auth/RoleSelectionScreen';
import StoryScreen from '@/Screens/Auth/StoryScreen';
import type { RootStackParamList } from '@/types';
import { useAuthStore } from '@/hooks/useAuthStore';

const Stack = createStackNavigator<RootStackParamList>();

export default () => {
  const user = useAuthStore((s) => s.user);
  const hasPendingAuth = !!getPendingAuth();
  const email = (user?.email ?? '').trim().toLowerCase();

  return (
    <Stack.Navigator
      screenOptions={{
        ...Constant.navigationOptions,
        gestureEnabled: true,
      }}
      initialRouteName={hasPendingAuth ? 'StoryScreen' : 'RoleSelectionScreen'}
    >
      <Stack.Screen
        name="RoleSelectionScreen"
        component={RoleSelectionScreen}
        initialParams={{ email: email || undefined }}
      />
      <Stack.Screen name="StoryScreen" component={StoryScreen} />
    </Stack.Navigator>
  );
};
