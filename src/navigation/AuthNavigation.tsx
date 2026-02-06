import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Constant } from '@/Helpers/Constant';
import LoginScreen from '@/Screens/Auth/LoginScreen';
import type { RootStackParamList } from '@/types';

const Stack = createStackNavigator<RootStackParamList>();

export default () => {
  return (
    <Stack.Navigator
      screenOptions={Constant.navigationOptions}
      initialRouteName="LoginScreen"
    >
      <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
    </Stack.Navigator>
  );
};
