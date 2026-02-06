export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  LoginScreen: undefined;
  BottomTabs: undefined;
  ChatScreen: { receiver: any };
  DashboardScreen: undefined;
  MedicineScreen: undefined;
  MedicineDetailsScreen: { medicine: any };
  UserProfileScreen: undefined;
  MapScreen: undefined;
  UserListScreen: undefined;
  CartScreen: undefined;
  DoctorsScreen: undefined;
  DoctorDetailsScreen: { doctor: any };
  LabTestsScreen: undefined;
  AppointmentsScreen: undefined;
  WellnessScreen: undefined;
  AyurvedaScreen: undefined;
  HomeCareScreen: undefined;
  BabyCareScreen: undefined;
};

export interface User {
  id: string;
  name: string;
  phone_number: string;
  avatar_url?: string;
  kyc_status?: 'pending' | 'verified' | 'rejected';
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  created_at: string;
}
