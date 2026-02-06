import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
import { Constant } from '@/Helpers/Constant';
import type { RootStackParamList } from '@/types';
import BottomTabs from './BottomTabs';
import ChatScreen from '@/Screens/Main/chatsocket/UserListScreen/ChatScreen';
import CartScreen from '@/Screens/Main/CartScreen/CartScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        ...Constant.navigationOptions,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
    </Stack.Navigator>
  );
};
