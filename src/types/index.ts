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
  LabTestDetailsScreen: { labTest: any };
  AppointmentDetailsScreen: { appointment: any };
  WellnessDetailsScreen: { wellness: any };
  AyurvedaDetailsScreen: { ayurveda: any };
  HomeCareDetailsScreen: { homeCare: any };
  BabyCareDetailsScreen: { babyCare: any };
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
  DoctorDashboardScreen: undefined;
  ClinicDashboardScreen: undefined;
  FactoryDashboardScreen: undefined;
  DoctorProfileScreen: undefined;
  DoctorAppointmentsScreen: undefined;
  DoctorServicesScreen: undefined;
  DoctorDocumentsScreen: undefined;
  DoctorPaymentsScreen: undefined;
};

export type UserRole = 'user' | 'doctor' | 'clinic' | 'factory';

export interface User {
  id: string;
  name: string;
  phone_number: string;
  avatar_url?: string;
  kyc_status?: 'pending' | 'verified' | 'rejected';
  roles?: UserRole[]; // User can have multiple roles
}

export interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  experience_years: number;
  consultation_fee: number;
  bio?: string;
  rating?: number;
  total_consultations?: number;
  available_for_audio?: boolean;
  available_for_video?: boolean;
  available_for_chat?: boolean;
  created_at?: string;
}

export interface Clinic {
  id: string;
  user_id: string;
  clinic_name: string;
  address: string;
  license_number?: string;
  rating?: number;
  total_orders?: number;
  created_at?: string;
}

export interface Factory {
  id: string;
  user_id: string;
  factory_name: string;
  address: string;
  license_number?: string;
  min_order_quantity?: number; // Minimum packets for bulk orders
  rating?: number;
  total_orders?: number;
  created_at?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  created_at: string;
}
