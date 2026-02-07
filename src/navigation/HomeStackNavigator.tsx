import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
import { Constant } from '@/Helpers/Constant';
import type { RootStackParamList } from '@/types';
import RoleBasedDashboard from '@/Screens/Main/CommonScreens/components/RoleBasedDashboard';
import DoctorsScreen from '@/Screens/Main/USER_MODEL/DoctorsScreen/DoctorsScreen';
import LabTestsScreen from '@/Screens/Main/USER_MODEL/LabTestsScreen/LabTestsScreen';
import AppointmentsScreen from '@/Screens/Main/USER_MODEL/AppointmentsScreen/AppointmentsScreen';
import WellnessScreen from '@/Screens/Main/USER_MODEL/WellnessScreen/WellnessScreen';
// import AyurvedaScreen from '@/Screens/Main/AyurvedaScreen/AyurvedaScreen';
// import HomeCareScreen from '@/Screens/Main/HomeCareScreen/HomeCareScreen';
// import BabyCareScreen from '@/Screens/Main/BabyCareScreen/BabyCareScreen';
import MedicineScreen from '@/Screens/Main/USER_MODEL/MedicineScreen/MedicineScreen';
import MedicineDetailsScreen from '@/Screens/Main/USER_MODEL/MedicineScreen/MedicineDetailsScreen';
import DoctorDetailsScreen from '@/Screens/Main/USER_MODEL/DoctorsScreen/DoctorDetailsScreen';
import LabTestDetailsScreen from '@/Screens/Main/USER_MODEL/LabTestsScreen/LabTestDetailsScreen';
import { AyurvedaScreen, BabyCareScreen, HomeCareScreen } from '@/Screens/Main/USER_MODEL/PlaceholderScreens';
import DoctorProfileScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorProfileScreen';
import DoctorAppointmentsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorAppointmentsScreen';
import DoctorDocumentsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorDocumentsScreen';
import DoctorPaymentsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorPaymentsScreen';

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
      <Stack.Screen name="DashboardScreen" component={RoleBasedDashboard} />
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
      
      {/* Doctor Model Screens */}
      <Stack.Screen name="DoctorProfileScreen" component={DoctorProfileScreen} />
      <Stack.Screen name="DoctorAppointmentsScreen" component={DoctorAppointmentsScreen} />
      <Stack.Screen name="DoctorDocumentsScreen" component={DoctorDocumentsScreen} />
      <Stack.Screen name="DoctorPaymentsScreen" component={DoctorPaymentsScreen} />
    </Stack.Navigator>
  );
};
