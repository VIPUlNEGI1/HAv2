export type RootStackParamList = {
  Auth: undefined;
  PostAuthOnboarding: undefined;
  Home: undefined;
  KYCScreen: undefined;
  AppOnboardingScreen: undefined;
  VerifyEmailScreen: undefined;
  RoleSelectionScreen: { email?: string };
  OnboardingScreen: { role: UserRole } | undefined;
  StoryScreen: undefined;
  LoginScreen: undefined;
  OTPVerificationScreen: { email: string; fromOnboarding?: boolean };
  BottomTabs: undefined;
  ChatScreen: { receiver: any };
  DashboardScreen: undefined;
  MedicineScreen: undefined;
  MedicineDetailsScreen: { medicine: any };
  UserProfileScreen: undefined;
  UserInfoScreen: undefined;
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
  DoctorChatScreen: { user?: any };
  DoctorVideoCallScreen: { user?: any };
  DoctorAudioCallScreen: { user?: any };
  DoctorSettingsScreen: undefined;
  DoctorManageServicesScreen: undefined;
  DoctorPatientListScreen: undefined;
  SettingsScreen: undefined;
  // Clinic Model Screens
  ClinicProductsScreen: undefined;
  ClinicOrdersScreen: undefined;
  ClinicExpensesScreen: undefined;
  ClinicLicensesScreen: undefined;
  ClinicFactoriesScreen: undefined;
  ClinicInventoryScreen: undefined;
  ClinicProfileScreen: undefined;
  ClinicSettingsScreen: undefined;
  FactoryProductsScreen: { factory: any };
  ClinicProductDetailsScreen: { product: any; editMode?: boolean };
  ClinicOrderDetailsScreen: { orderId: string };
  ClinicChatScreen: { user?: any };
  // Factory Model Screens
  FactoryManageProductsScreen: undefined;
  FactoryClientsScreen: undefined;
  FactoryClientDetailsScreen: { clientId: string };
  FactoryOrdersScreen: undefined;
  FactoryOrderDetailsScreen: { orderId: string };
  FactoryPaymentsScreen: undefined;
  FactoryShippingScreen: undefined;
  FactoryProfileScreen: undefined;
  FactorySettingsScreen: undefined;
  FactoryProductDetailsScreen: { product: any; editMode?: boolean };
  FactoryChatScreen: { user?: any };
};

export type UserRole = 'user' | 'doctor' | 'clinic' | 'factory';

export interface UserLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface SavedAddress {
  type?: 'home' | 'work' | 'other';
  label?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  location?: { latitude?: number; longitude?: number };
  is_default?: boolean;
}

export interface PaymentMethod {
  type?: 'card' | 'upi' | 'wallet';
  provider?: string;
  last_four?: string;
  expiry_date?: string;
  is_default?: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone_number: string;
  age?: number | null;
  gender?: string | null;
  avatar_url?: string;
  location?: UserLocation;
  saved_addresses?: SavedAddress[];
  payment_methods?: PaymentMethod[];
  kyc_status?: 'pending' | 'verified' | 'rejected';
  roles?: UserRole[]; // User can have multiple roles
}

/** Onboarding form data saved to MMKV before login */
export interface OnboardingProfile {
  role: UserRole;
  /** Common */
  name: string;
  email: string;
  mobile: string;
  /** User */
  age?: string;
  gender?: string;
  /** Doctor */
  specialization?: string;
  experience_years?: string;
  license_number?: string;
  qualification?: string;
  /** Clinic */
  clinic_name?: string;
  clinic_address?: string;
  clinic_license?: string;
  /** Factory */
  factory_name?: string;
  factory_address?: string;
  factory_license?: string;
  min_order_quantity?: string;
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
