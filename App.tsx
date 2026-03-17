import 'react-native-reanimated';
import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { CommonStyle } from '@/Theme';
import AppNavigation from '@/navigation/Appnavagation';
import { getPersistedAuthToken } from '@/Helpers/AppStorage';

LogBox.ignoreAllLogs();

export default function App() {
  const token = getPersistedAuthToken();
  console.log('App component rendered', token ? 'token present' : 'no token');
  return (
    
    <GestureHandlerRootView style={CommonStyle.flex}>
      <StatusBar hidden translucent backgroundColor="transparent" />
      <KeyboardProvider>
        <AppNavigation />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
