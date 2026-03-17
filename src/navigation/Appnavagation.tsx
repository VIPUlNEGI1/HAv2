import { Toasts } from '@backpackapp-io/react-native-toast';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLoader, Loader } from '@/Components';
import { Constant } from '@/Helpers/Constant';
import { CommonStyle } from '@/Theme';
import type { RootStackParamList } from '@/types';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useLocationTracker } from '@/hooks/useLocationTracker';

import AuthNavigation from './AuthNavigation';
import HomeNavigation from './HomeNavigation';
import { navigationRef } from './RootNavigation';

const Stack = createStackNavigator<RootStackParamList>();

type RootRouteName = 'Auth' | 'Home';

function getInitialRouteName(hasToken: boolean): RootRouteName {
  return hasToken ? 'Home' : 'Auth';
}

const authStorePersist = (useAuthStore as unknown as { persist?: { hasHydrated: () => boolean; onFinishHydration: (cb: () => void) => () => void } }).persist;

export default function AppNavigation() {
  useLocationTracker();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (!authStorePersist) {
      setHasHydrated(true);
      return;
    }
    if (authStorePersist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    const unsub = authStorePersist.onFinishHydration(() => setHasHydrated(true));
    return () => unsub?.();
  }, []);

  const token = useAuthStore((s) => s.token);
  const fetchUserProfile = useAuthStore((s) => s.fetchUserProfile);
  const hasToken = !!token;
  const initialRouteName = useMemo(() => getInitialRouteName(hasToken), [hasToken]);

  // After rehydration, fetch full profile once so Profile/Settings/Documents/Payment show DB data
  useEffect(() => {
    if (hasHydrated && token) fetchUserProfile().catch(() => {});
  }, [hasHydrated, token, fetchUserProfile]);

  if (!hasHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4B2A99" />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={CommonStyle.flex}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          key={initialRouteName}
          screenOptions={{
            ...Constant.navigationOptions,
          }}
          initialRouteName={initialRouteName}
        >
          <Stack.Screen name="Auth" component={AuthNavigation} />
          <Stack.Screen name="Home" component={HomeNavigation} />
        </Stack.Navigator>
      </NavigationContainer>

      <AppLoader ref={(ref: any) => Loader.setLoader(ref)} />
      <Toasts />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
