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
import DoctorProfileScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorProfileScreen/DoctorProfileScreen';
import DoctorAppointmentsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorAppointmentsScreen/DoctorAppointmentsScreen';
import DoctorDocumentsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorDocumentsScreen/DoctorDocumentsScreen';
import DoctorPaymentsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorPaymentsScreen/DoctorPaymentsScreen';
import DoctorChatScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorChatScreen/DoctorChatScreen';
import DoctorVideoCallScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorVideoCallScreen/DoctorVideoCallScreen';
import DoctorAudioCallScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorAudioCallScreen/DoctorAudioCallScreen';
import DoctorSettingsScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorSettingsScreen/DoctorSettingsScreen';
import DoctorManageServicesScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorManageServicesScreen/DoctorManageServicesScreen';
import DoctorPatientListScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorPatientListScreen/DoctorPatientListScreen';
import DoctorDashboardScreen from '@/Screens/Main/DOCTOR_MODEL/DoctorDashboardScreen/DoctorDashboardScreen';
import SettingsScreen from '@/Screens/Main/CommonScreens/SettingsScreen';
import UserInfoScreen from '@/Screens/Main/USER_MODEL/UserInfoScreen/UserInfoScreen';
// Clinic Model Screens
import ClinicProductsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicProductsScreen/ClinicProductsScreen';
import ClinicOrdersScreen from '@/Screens/Main/CLINIC_MODEL/ClinicOrdersScreen/ClinicOrdersScreen';
import ClinicExpensesScreen from '@/Screens/Main/CLINIC_MODEL/ClinicExpensesScreen/ClinicExpensesScreen';
import ClinicLicensesScreen from '@/Screens/Main/CLINIC_MODEL/ClinicLicensesScreen/ClinicLicensesScreen';
import ClinicFactoriesScreen from '@/Screens/Main/CLINIC_MODEL/ClinicFactoriesScreen/ClinicFactoriesScreen';
import ClinicInventoryScreen from '@/Screens/Main/CLINIC_MODEL/ClinicInventoryScreen/ClinicInventoryScreen';
import ClinicProfileScreen from '@/Screens/Main/CLINIC_MODEL/ClinicProfileScreen/ClinicProfileScreen';
import ClinicSettingsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicSettingsScreen/ClinicSettingsScreen';
import ClinicDashboardScreen from '@/Screens/Main/CLINIC_MODEL/ClinicDashboardScreen/ClinicDashboardScreen';
import FactoryProductsScreen from '@/Screens/Main/CLINIC_MODEL/FactoryProductsScreen/FactoryProductsScreen';
import ClinicProductDetailsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicProductDetailsScreen/ClinicProductDetailsScreen';
import ClinicOrderDetailsScreen from '@/Screens/Main/CLINIC_MODEL/ClinicOrderDetailsScreen/ClinicOrderDetailsScreen';
import ClinicChatScreen from '@/Screens/Main/CLINIC_MODEL/ClinicChatScreen/ClinicChatScreen';
// Factory Model Screens
import FactoryManageProductsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryManageProductsScreen/FactoryManageProductsScreen';
import FactoryClientsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryClientsScreen/FactoryClientsScreen';
import FactoryClientDetailsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryClientDetailsScreen/FactoryClientDetailsScreen';
import FactoryOrdersScreen from '@/Screens/Main/FACTORY_MODEL/FactoryOrdersScreen/FactoryOrdersScreen';
import FactoryOrderDetailsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryOrderDetailsScreen/FactoryOrderDetailsScreen';
import FactoryPaymentsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryPaymentsScreen/FactoryPaymentsScreen';
import FactoryShippingScreen from '@/Screens/Main/FACTORY_MODEL/FactoryShippingScreen/FactoryShippingScreen';
import FactoryProfileScreen from '@/Screens/Main/FACTORY_MODEL/FactoryProfileScreen/FactoryProfileScreen';
import FactorySettingsScreen from '@/Screens/Main/FACTORY_MODEL/FactorySettingsScreen/FactorySettingsScreen';
import FactoryProductDetailsScreen from '@/Screens/Main/FACTORY_MODEL/FactoryProductDetailsScreen/FactoryProductDetailsScreen';
import FactoryChatScreen from '@/Screens/Main/FACTORY_MODEL/FactoryChatScreen/FactoryChatScreen';
import FactoryDashboardScreen from '@/Screens/Main/FACTORY_MODEL/FactoryDashboardScreen/FactoryDashboardScreen';

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
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen 
        name="DoctorAudioCallScreen" 
        component={DoctorAudioCallScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="DoctorSettingsScreen" component={DoctorSettingsScreen} />
      <Stack.Screen name="DoctorManageServicesScreen" component={DoctorManageServicesScreen} />
      <Stack.Screen name="DoctorPatientListScreen" component={DoctorPatientListScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
      
      {/* Clinic Model Screens */}
      <Stack.Screen name="ClinicDashboardScreen" component={ClinicDashboardScreen} />
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
