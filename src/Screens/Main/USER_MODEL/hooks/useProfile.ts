import { Alert } from 'react-native';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useThemeStore } from '@/hooks/useThemeStore';

export const useProfile = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

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

  const dummyAvatar = 'https://i.pravatar.cc/150?u=' + (user?.id || 'default');

  return {
    user,
    logout,
    isDarkMode,
    toggleTheme,
    handleDeleteAccount,
    profileStats,
    dummyAvatar
  };
};
