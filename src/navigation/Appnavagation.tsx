import { Toasts } from '@backpackapp-io/react-native-toast';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLoader, Loader } from '@/Components';
import { Constant } from '@/Helpers/Constant';
import { CommonStyle } from '@/Theme';
import type { RootStackParamList } from '@/types';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useLocationTracker } from '@/hooks/useLocationTracker';

import HomeNavigation from './HomeNavigation';
import { navigationRef } from './RootNavigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigatorContent = () => {
  const { isAuthenticated } = useAuthStore();
  useLocationTracker();

  return (
    <Stack.Navigator
      screenOptions={{
        ...Constant.navigationOptions,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Home" component={HomeNavigation} />
      ) : (
        <Stack.Screen name="Home" component={HomeNavigation} />
      )}
    </Stack.Navigator>
  );
};

export default () => {
  return (
    <SafeAreaProvider style={CommonStyle.flex}>
      <GestureHandlerRootView style={CommonStyle.flex}>
        <NavigationContainer ref={navigationRef}>
          <AppNavigatorContent />
        </NavigationContainer>

        <AppLoader ref={(ref: any) => Loader.setLoader(ref)} />
        <Toasts />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
