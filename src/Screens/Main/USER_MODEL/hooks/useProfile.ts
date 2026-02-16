import { Alert } from 'react-native';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { getOnboardingProfileParsed } from '@/Helpers/AppStorage';

export const useProfile = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const storedProfile = getOnboardingProfileParsed();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Delete Account Logic'),
        },
      ]
    );
  };

  const profileStats = [
    { label: 'Orders', value: '12' },
    { label: 'Active', value: '2' },
    { label: 'Saved', value: '₹450' },
  ];

  const avatarUrl = user?.avatar_url || 'https://i.pravatar.cc/150?u=' + (user?.id || 'default');

  const displayName = user?.name ?? storedProfile?.name ?? '';
  const displayEmail = user?.email ?? storedProfile?.email ?? '';
  const displayPhone = user?.phone_number ?? storedProfile?.mobile ?? '';
  const displayAge = storedProfile?.age ?? '';
  const displayGender = storedProfile?.gender ?? '';

  return {
    user,
    storedProfile,
    displayName,
    displayEmail,
    displayPhone,
    displayAge,
    displayGender,
    logout,
    isDarkMode,
    toggleTheme,
    handleDeleteAccount,
    profileStats,
    avatarUrl,
  };
};
