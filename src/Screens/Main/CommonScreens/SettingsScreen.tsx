import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Switch,
  Alert,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { 
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Lock,
  HelpCircle,
  LogOut,
  Trash2,
  Camera,
  Mail,
  Phone,
  Edit2,
  ChevronRight,
  Settings as SettingsIcon,
  Stethoscope,
  Building2,
  Factory,
  CreditCard,
} from 'lucide-react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { useNavigation } from '@react-navigation/native';
import { useRoleStore } from '@/hooks/useRoleStore';
import type { UserRole } from '@/types';

const SettingsScreen = () => {
  const { theme, shadows, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();
  const { currentRole } = useRoleStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          setProfileImage(response.assets[0].uri || null);
          toast.success('Profile image updated!');
        }
      }
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          setProfileImage(response.assets[0].uri || null);
          toast.success('Profile image updated!');
        }
      }
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            toast.success('Logged out successfully');
            // In real app, handle logout
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            toast.error('Account deletion requested');
            // In real app, handle account deletion
          },
        },
      ]
    );
  };

  const getProfileScreen = () => {
    switch (currentRole) {
      case 'doctor':
        return 'DoctorProfileScreen';
      case 'clinic':
        return 'ClinicProfileScreen';
      case 'factory':
        return 'FactoryProfileScreen';
      default:
        return 'UserProfileScreen';
    }
  };

  const SettingSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.surface, ...shadows }]}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    showChevron = true,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
        <Icon size={moderateScale(20)} color={theme.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {rightComponent || (showChevron && onPress && (
        <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
      ))}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper title="Settings" showBack={true} scrollable={true}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Animated.View entering={FadeInDown.delay(0)}>
          <SettingSection title="PROFILE">
            <View style={styles.profileSection}>
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={handleImagePicker}
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.primary + '20' }]}>
                    <User size={moderateScale(40)} color={theme.primary} />
                  </View>
                )}
                <View style={[styles.cameraIcon, { backgroundColor: theme.primary }]}>
                  <Camera size={moderateScale(14)} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {currentRole === 'doctor' ? 'Dr. Smith' : 
                   currentRole === 'clinic' ? 'City Clinic' :
                   currentRole === 'factory' ? 'MedFactory' : 'User Name'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                  user@example.com
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.editProfileBtn, { borderColor: theme.primary }]}
                onPress={() => navigation.navigate(getProfileScreen() as any)}
              >
                <Edit2 size={moderateScale(16)} color={theme.primary} />
                <Text style={[styles.editProfileText, { color: theme.primary }]}>Edit</Text>
              </TouchableOpacity>
            </View>
          </SettingSection>
        </Animated.View>

        {/* Account Settings */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <SettingSection title="ACCOUNT">
            <SettingItem
              icon={User}
              title="Personal Information"
              subtitle="Update your personal details"
              onPress={() => navigation.navigate(getProfileScreen() as any)}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={Mail}
              title="Email"
              subtitle="user@example.com"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={Phone}
              title="Phone Number"
              subtitle="+91 9876543210"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={Lock}
              title="Password & Security"
              subtitle="Change password and security settings"
              onPress={() => {}}
            />
          </SettingSection>
        </Animated.View>

        {/* Role-Specific Settings */}
        {currentRole === 'doctor' && (
          <Animated.View entering={FadeInDown.delay(150)}>
            <SettingSection title="DOCTOR SERVICES">
              <SettingItem
                icon={Stethoscope}
                title="Manage Services"
                subtitle="Update consultation fees and services"
                onPress={() => navigation.navigate('DoctorManageServicesScreen')}
              />
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <SettingItem
                icon={CreditCard}
                title="Earnings & Payouts"
                subtitle="View your revenue"
                onPress={() => navigation.navigate('DoctorPaymentsScreen')}
              />
            </SettingSection>
          </Animated.View>
        )}

        {/* Preferences */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <SettingSection title="PREFERENCES">
            <SettingItem
              icon={isDarkMode ? Moon : Sun}
              title="Theme"
              subtitle={isDarkMode ? 'Dark Mode' : 'Light Mode'}
              rightComponent={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#fff"
                />
              }
              showChevron={false}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle="Manage notification preferences"
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#fff"
                />
              }
              showChevron={false}
            />
          </SettingSection>
        </Animated.View>

        {/* Support & About */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <SettingSection title="SUPPORT & ABOUT">
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={SettingsIcon}
              title="App Version"
              subtitle="1.0.0"
              showChevron={false}
            />
          </SettingSection>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <SettingSection title="DANGER ZONE">
            <SettingItem
              icon={LogOut}
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={Trash2}
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
            />
          </SettingSection>
        </Animated.View>

        <View style={{ height: verticalScale(30) }} />
      </ScrollView>
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: verticalScale(8),
    paddingHorizontal: moderateScale(4),
  },
  sectionContent: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(20),
    gap: moderateScale(16),
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  profileImagePlaceholder: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: moderateScale(18),
    fontWeight: '900',
    marginBottom: verticalScale(2),
  },
  profileEmail: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1.5,
    gap: moderateScale(6),
  },
  editProfileText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    gap: moderateScale(16),
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  settingSubtitle: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginLeft: moderateScale(72),
  },
});

export default SettingsScreen;
