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
import DoctorChatScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorChatScreen';
import DoctorVideoCallScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorVideoCallScreen';
import DoctorAudioCallScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorAudioCallScreen';
import DoctorSettingsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorSettingsScreen';
import DoctorManageServicesScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorManageServicesScreen';
import DoctorPatientListScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorPatientListScreen';
import SettingsScreen from '@/Screens/Main/CommonScreens/SettingsScreen';
// Clinic Model Screens
import ClinicProductsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicProductsScreen';
import ClinicOrdersScreen from '@/Screens/Main/CLINIC_MODEL/ClinicOrdersScreen';
import ClinicExpensesScreen from '@/Screens/Main/CLINIC_MODEL/ClinicExpensesScreen';
import ClinicLicensesScreen from '@/Screens/Main/CLINIC_MODEL/ClinicLicensesScreen';
import ClinicFactoriesScreen from '@/Screens/Main/CLINIC_MODEL/ClinicFactoriesScreen';
import ClinicInventoryScreen from '@/Screens/Main/CLINIC_MODEL/ClinicInventoryScreen';
import ClinicProfileScreen from '@/Screens/Main/CLINIC_MODEL/ClinicProfileScreen';
import ClinicSettingsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicSettingsScreen';
import FactoryProductsScreen from '@/Screens/Main/CLINIC_MODEL/FactoryProductsScreen';
import ClinicProductDetailsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicProductDetailsScreen';
import ClinicOrderDetailsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicOrderDetailsScreen';
import ClinicChatScreen from '@/Screens/Main/CLINIC_MODEL/ClinicChatScreen';
// Factory Model Screens
import FactoryManageProductsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryManageProductsScreen';
import FactoryClientsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryClientsScreen';
import FactoryClientDetailsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryClientDetailsScreen';
import FactoryOrdersScreen from '@/Screens/Main/FACTORY_MODEL/FactoryOrdersScreen';
import FactoryOrderDetailsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryOrderDetailsScreen';
import FactoryPaymentsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryPaymentsScreen';
import FactoryShippingScreen from '@/Screens/Main/FACTORY_MODEL/FactoryShippingScreen';
import FactoryProfileScreen from '@/Screens/Main/FACTORY_MODEL/FactoryProfileScreen';
import FactorySettingsScreen from '@/Screens/Main/FACTORY_MODEL/FactorySettingsScreen';
import FactoryProductDetailsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryProductDetailsScreen';
import FactoryChatScreen from '@/Screens/Main/FACTORY_MODEL/FactoryChatScreen';

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
      <Stack.Screen 
        name="DoctorChatScreen" 
        component={DoctorChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DoctorVideoCallScreen" 
        component={DoctorVideoCallScreen}
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen 
        name="DoctorAudioCallScreen" 
        component={DoctorAudioCallScreen}
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen name="DoctorSettingsScreen" component={DoctorSettingsScreen} />
      <Stack.Screen name="DoctorManageServicesScreen" component={DoctorManageServicesScreen} />
      <Stack.Screen name="DoctorPatientListScreen" component={DoctorPatientListScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      
      {/* Clinic Model Screens */}
      <Stack.Screen name="ClinicProductsScreen" component={ClinicProductsScreen} />
      <Stack.Screen name="ClinicOrdersScreen" component={ClinicOrdersScreen} />
      <Stack.Screen name="ClinicExpensesScreen" component={ClinicExpensesScreen} />
      <Stack.Screen name="ClinicLicensesScreen" component={ClinicLicensesScreen} />
      <Stack.Screen name="ClinicFactoriesScreen" component={ClinicFactoriesScreen} />
      <Stack.Screen name="ClinicInventoryScreen" component={ClinicInventoryScreen} />
      <Stack.Screen name="ClinicProfileScreen" component={ClinicProfileScreen} />
      <Stack.Screen name="ClinicSettingsScreen" component={ClinicSettingsScreen} />
      <Stack.Screen name="FactoryProductsScreen" component={FactoryProductsScreen} />
      <Stack.Screen name="ClinicProductDetailsScreen" component={ClinicProductDetailsScreen} />
      <Stack.Screen name="ClinicOrderDetailsScreen" component={ClinicOrderDetailsScreen} />
      <Stack.Screen 
        name="ClinicChatScreen" 
        component={ClinicChatScreen}
        options={{ headerShown: false }}
      />
      
      {/* Factory Model Screens */}
      <Stack.Screen name="FactoryManageProductsScreen" component={FactoryManageProductsScreen} />
      <Stack.Screen name="FactoryClientsScreen" component={FactoryClientsScreen} />
      <Stack.Screen name="FactoryClientDetailsScreen" component={FactoryClientDetailsScreen} />
      <Stack.Screen name="FactoryOrdersScreen" component={FactoryOrdersScreen} />
      <Stack.Screen name="FactoryOrderDetailsScreen" component={FactoryOrderDetailsScreen} />
      <Stack.Screen name="FactoryPaymentsScreen" component={FactoryPaymentsScreen} />
      <Stack.Screen name="FactoryShippingScreen" component={FactoryShippingScreen} />
      <Stack.Screen name="FactoryProfileScreen" component={FactoryProfileScreen} />
      <Stack.Screen name="FactorySettingsScreen" component={FactorySettingsScreen} />
      <Stack.Screen name="FactoryProductDetailsScreen" component={FactoryProductDetailsScreen} />
      <Stack.Screen 
        name="FactoryChatScreen" 
        component={FactoryChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
