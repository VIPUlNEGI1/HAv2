import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
import { Constant } from '@/Helpers/Constant';
import type { RootStackParamList } from '@/types';
import BottomTabs from './BottomTabs';
import ChatScreen from '@/Screens/Main/CommonScreens/chatsocket/UserListScreen/ChatScreen';
import CartScreen from '@/Screens/Main/CommonScreens/CartScreen/CartScreen';
import SettingsScreen from '@/Screens/Main/CommonScreens/SettingsScreen';
import UserInfoScreen from '@/Screens/Main/USER_MODEL/UserInfoScreen/UserInfoScreen';

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
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
    </Stack.Navigator>
  );
};
