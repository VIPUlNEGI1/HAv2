import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
import { Constant } from '@/Helpers/Constant';
import type { RootStackParamList } from '@/types';
import DashboardScreen from '@/Screens/Main/DashboardScreen/DashboardScreen';
import DoctorsScreen from '@/Screens/Main/DoctorsScreen/DoctorsScreen';
import LabTestsScreen from '@/Screens/Main/LabTestsScreen/LabTestsScreen';
import AppointmentsScreen from '@/Screens/Main/AppointmentsScreen/AppointmentsScreen';
import WellnessScreen from '@/Screens/Main/WellnessScreen/WellnessScreen';
import AyurvedaScreen from '@/Screens/Main/AyurvedaScreen/AyurvedaScreen';
import HomeCareScreen from '@/Screens/Main/HomeCareScreen/HomeCareScreen';
import BabyCareScreen from '@/Screens/Main/BabyCareScreen/BabyCareScreen';
import MedicineScreen from '@/Screens/Main/MedicineScreen/MedicineScreen';
import MedicineDetailsScreen from '@/Screens/Main/MedicineScreen/MedicineDetailsScreen';
import DoctorDetailsScreen from '@/Screens/Main/DoctorsScreen/DoctorDetailsScreen';
import LabTestDetailsScreen from '@/Screens/Main/LabTestsScreen/LabTestDetailsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        ...Constant.navigationOptions,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        gestureEnabled: true,
        gestureDirection: 'vertical',
        presentation: 'transparentModal',
      }}
    >
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="MedicineScreen" component={MedicineScreen} />
      <Stack.Screen 
        name="MedicineDetailsScreen" 
        component={MedicineDetailsScreen}
      />
      <Stack.Screen name="DoctorsScreen" component={DoctorsScreen} />
      <Stack.Screen 
        name="DoctorDetailsScreen" 
        component={DoctorDetailsScreen} 
      />
      <Stack.Screen name="LabTestsScreen" component={LabTestsScreen} />
      <Stack.Screen name="LabTestDetailsScreen" component={LabTestDetailsScreen} />
      <Stack.Screen name="AppointmentsScreen" component={AppointmentsScreen} />
      <Stack.Screen name="WellnessScreen" component={WellnessScreen} />
      <Stack.Screen name="AyurvedaScreen" component={AyurvedaScreen} />
      <Stack.Screen name="HomeCareScreen" component={HomeCareScreen} />
      <Stack.Screen name="BabyCareScreen" component={BabyCareScreen} />
    </Stack.Navigator>
  );
};
