import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { useNavigation } from '@react-navigation/native';
import { useRoleStore } from '@/hooks/useRoleStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import type { UserRole } from '@/types';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { pickProfileImage } from '@/Helpers/imagePicker';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

const roleDisplayNames: Record<UserRole, string> = { user: 'User', doctor: 'Doctor', clinic: 'Clinic', factory: 'Factory' };

const SettingsScreen = () => {
  const { theme, shadows, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();
  const { currentRole, setRole, availableRoles } = useRoleStore();
  const { user, logout, token } = useAuthStore();
  const { updateUser } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatar_url ?? null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  useEffect(() => {
    if (user?.avatar_url) setProfileImage(user.avatar_url);
  }, [user?.avatar_url]);

  const uploadAndSetAvatar = async (uri: string) => {
    if (!token) return;
    setUploadingImage(true);
    try {
      const res = await APICall<{ data?: { avatar_url?: string } }>(
        'post',
        { image_url: uri },
        ApiRoutes.profile.uploadImage,
        {},
        token
      );
      if (res.status === 200 && res.data?.data?.avatar_url) {
        const url = res.data.data.avatar_url;
        setProfileImage(url);
        updateUser({ avatar_url: url });
        toast.success('Profile photo updated');
      } else {
        setProfileImage(uri);
        updateUser({ avatar_url: uri });
        toast.success('Profile photo updated');
      }
    } catch {
      setProfileImage(uri);
      toast.success('Photo set locally. Upload failed — try again later.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Profile photo',
      'Take a new photo or choose from gallery',
      [
        { text: 'Take photo', onPress: () => openPicker('camera') },
        { text: 'Choose from gallery', onPress: () => openPicker('gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openPicker = (source: 'camera' | 'gallery') => {
    pickProfileImage(source, (uri, error) => {
      if (error) {
        toast.error(error);
        return;
      }
      if (uri) {
        setProfileImage(uri);
        uploadAndSetAvatar(uri);
      }
    });
  };

  const handleRoleSelect = async (role: UserRole) => {
    if (role === currentRole) {
      setRoleModalVisible(false);
      return;
    }
    const roleName = roleDisplayNames[role];
    Alert.alert(
      'Switch Role',
      `Are you sure you want to switch to ${roleName}? You will receive a confirmation email.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {} },
        {
          text: 'Switch',
          onPress: async () => {
            if (!token) {
              setRole(role);
              setRoleModalVisible(false);
              toast.success(`Role switched to ${roleName}`);
              return;
            }
            try {
              const { APICall } = await import('@/api/client');
              const { ApiRoutes } = await import('@/api/routes');
              const res = await APICall<{ data?: { current_role?: string } }>(
                'post',
                { role },
                ApiRoutes.roles.switch,
                {},
                token
              );
              if (res.status === 200) {
                setRole(role);
                setRoleModalVisible(false);
                toast.success(`Role switched to ${roleName}. Check your email for confirmation.`);
              } else {
                const msg = (res.data as { message?: string })?.message || 'Could not switch role.';
                toast.error(msg);
              }
            } catch {
              toast.error('Could not switch role. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getRoleDisplayName = (role: UserRole | null) => {
    if (!role) return 'Select Role';
    const names: Record<UserRole, string> = { user: 'User', doctor: 'Doctor', clinic: 'Clinic', factory: 'Factory' };
    return names[role] || role;
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
            logout();
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
        {/* Profile Hero Section */}
        <Animated.View entering={FadeInDown.delay(0)}>
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border, ...shadows }]}>
            <View style={styles.heroInner}>
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={handleImagePicker}
                activeOpacity={0.85}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.primary + '18' }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                  </View>
                ) : profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.primary + '18' }]}>
                    <User size={moderateScale(44)} color={theme.primary} strokeWidth={1.5} />
                  </View>
                )}
                <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                  <Camera size={moderateScale(18)} color="#fff" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]} numberOfLines={1}>
                  {user?.name ?? (currentRole === 'doctor' ? 'Dr. Smith' : currentRole === 'clinic' ? 'City Clinic' : currentRole === 'factory' ? 'MedFactory' : 'User')}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]} numberOfLines={1}>
                  {user?.email ?? user?.phone_number ?? '—'}
                </Text>
                <TouchableOpacity
                  style={[styles.editProfileBtn, { borderColor: theme.primary }]}
                  onPress={() => navigation.navigate(getProfileScreen() as any)}
                  activeOpacity={0.8}
                >
                  <Edit2 size={moderateScale(16)} color={theme.primary} strokeWidth={2} />
                  <Text style={[styles.editProfileText, { color: theme.primary }]}>Edit profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
              subtitle={user?.email ?? 'Add email'}
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingItem
              icon={Phone}
              title="Phone Number"
              subtitle={user?.phone_number ?? 'Add phone'}
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

        {/* Preferences - Theme, Role, Notifications */}
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
              icon={currentRole === 'doctor' ? Stethoscope : currentRole === 'clinic' ? Building2 : currentRole === 'factory' ? Factory : User}
              title="Switch Role"
              subtitle={`Current: ${getRoleDisplayName(currentRole)}`}
              onPress={() => setRoleModalVisible(true)}
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

      <RoleSelectionModal
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
        onRoleSelect={handleRoleSelect}
        availableRoles={availableRoles.length > 0 ? availableRoles : ['user', 'doctor', 'clinic', 'factory']}
        closeOnSelect={false}
      />
      <Toasts />
    </ScreenWrapper>
  );
};

const AVATAR_SIZE = moderateScale(88);
const CAMERA_BADGE_SIZE = moderateScale(32);

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(20),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: verticalScale(10),
    paddingHorizontal: moderateScale(4),
  },
  sectionContent: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  heroCard: {
    borderRadius: moderateScale(20),
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: verticalScale(24),
    overflow: 'hidden',
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(24),
    gap: moderateScale(20),
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  profileImagePlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: CAMERA_BADGE_SIZE,
    height: CAMERA_BADGE_SIZE,
    borderRadius: CAMERA_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: verticalScale(4),
    letterSpacing: 0.2,
  },
  profileEmail: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    opacity: 0.85,
    marginBottom: verticalScale(12),
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    gap: moderateScale(6),
  },
  editProfileText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
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
