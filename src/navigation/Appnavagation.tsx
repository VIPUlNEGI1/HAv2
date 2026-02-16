import { Toasts } from '@backpackapp-io/react-native-toast';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLoader, Loader } from '@/Components';
import { Constant } from '@/Helpers/Constant';
import { getHasSeenStory } from '@/Helpers/AppStorage';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { CommonStyle } from '@/Theme';
import type { RootStackParamList } from '@/types';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useLocationTracker } from '@/hooks/useLocationTracker';

import AuthNavigation from './AuthNavigation';
import PostAuthOnboardingNavigation from './PostAuthOnboardingNavigation';
import HomeNavigation from './HomeNavigation';
import KYCScreen from '@/Screens/Auth/KYCScreen';
import { navigationRef } from './RootNavigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigatorContent = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [hasHydrated, setHasHydrated] = useState(false);
  useLocationTracker();

  useEffect(() => {
    const store = useAuthStore as typeof useAuthStore & { persist?: { hasHydrated: () => boolean; onFinishHydration: (cb: () => void) => () => void } };
    if (!store.persist) {
      setHasHydrated(true);
      return;
    }
    if (store.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    const unsub = store.persist.onFinishHydration(() => setHasHydrated(true));
    return () => unsub?.();
  }, []);

  const isAuthenticated = !!token;
  const storyCompleted = useOnboardingStore((s) => s.storyCompleted);
  const hasSeenStory = getHasSeenStory() || storyCompleted;
  const kycVerified = user?.kyc_status === 'verified';

  if (!hasHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4B2A99" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        ...Constant.navigationOptions,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigation} />
      ) : !hasSeenStory ? (
        <Stack.Screen name="PostAuthOnboarding" component={PostAuthOnboardingNavigation} />
      ) : kycVerified ? (
        <Stack.Screen name="Home" component={HomeNavigation} />
      ) : (
        <Stack.Screen name="KYCScreen" component={KYCScreen} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

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
