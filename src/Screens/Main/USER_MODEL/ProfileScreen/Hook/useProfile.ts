import { Alert } from 'react-native';
import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { getOnboardingProfileParsed } from '@/Helpers/AppStorage';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';
import type { UserLocation } from '@/types';

export const useProfile = () => {
  const { user, logout, updateUser, token } = useAuthStore();
  const [savingAddress, setSavingAddress] = useState(false);

  // Fetch full profile on mount (user + saved_addresses, payment_methods, etc. from GET /api/profile)
  useEffect(() => {
    if (!token) return;
    APICall<{
      data?: {
        user?: {
          id?: string;
          name?: string;
          email?: string;
          phone_number?: string;
          age?: number | null;
          gender?: string | null;
          avatar_url?: string;
          location?: UserLocation;
          saved_addresses?: unknown[];
          payment_methods?: unknown[];
        };
      };
    }>('get', {}, ApiRoutes.profile.get, {}, token).then((res) => {
      if (__DEV__ && console?.log) {
        const data = (res as { data?: { data?: { user?: unknown } } }).data;
        console.log('[Profile] useProfile GET /api/profile:', { status: res.status, hasData: !!data?.data, hasUser: !!data?.data?.user });
        if (data?.data?.user) console.log('[Profile] useProfile backend user (keys):', Object.keys(data.data.user as Record<string, unknown>));
      }
      if (res.status === 200 && res.data?.data?.user) {
        const u = res.data.data.user;
        updateUser({
          name: u.name,
          email: u.email,
          phone_number: u.phone_number,
          age: u.age,
          gender: u.gender,
          avatar_url: u.avatar_url,
          location: u.location,
          saved_addresses: u.saved_addresses as any,
          payment_methods: u.payment_methods as any,
        });
      }
    });
  }, [token, updateUser]);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const storedProfile = getOnboardingProfileParsed();

  const handleSaveCurrentLocation = async () => {
    if (!token) return;
    setSavingAddress(true);
    const requestLocation = () => {
      Geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await APICall<{ data?: unknown }>(
              'post',
              {
                type: 'other',
                label: 'Current Location',
                location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
              },
              ApiRoutes.profile.addresses,
              {},
              token,
            );
            if (res.status === 201) {
              const profileRes = await APICall<{ data?: { user?: { saved_addresses?: unknown[] } } }>(
                'get',
                {},
                ApiRoutes.auth.me,
                {},
                token,
              );
              if (profileRes.status === 200 && profileRes.data?.data) {
                const u = profileRes.data.data as { saved_addresses?: unknown[] };
                updateUser({ saved_addresses: u.saved_addresses ?? [] });
              }
              Alert.alert('Success', 'Location saved to your addresses.');
            } else {
              const msg = (res.data as { message?: string })?.message || 'Could not save address.';
              Alert.alert('Error', msg);
            }
          } catch {
            Alert.alert('Error', 'Could not save address. Please try again.');
          } finally {
            setSavingAddress(false);
          }
        },
        () => {
          Alert.alert('Error', 'Could not get location. Please enable location and try again.');
          setSavingAddress(false);
        },
        { enableHighAccuracy: true, timeout: 15000 },
      );
    };
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) requestLocation();
      else {
        Alert.alert('Permission needed', 'Location permission is required to save your address.');
        setSavingAddress(false);
      }
    } else {
      Geolocation.requestAuthorization();
      requestLocation();
    }
  };

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
  const displayAge = user?.age != null ? String(user.age) : storedProfile?.age ?? '';
  const displayGender = user?.gender ?? storedProfile?.gender ?? '';
  const location: UserLocation | null = user?.location ?? null;
  const displayLocation = location
    ? location.address ?? (location.latitude != null ? `${location.latitude.toFixed(4)}, ${location.longitude?.toFixed(4)}` : null)
    : null;
  const savedAddressCount = user?.saved_addresses?.length ?? 0;

  return {
    user,
    storedProfile,
    displayName,
    displayEmail,
    displayPhone,
    displayAge,
    displayGender,
    displayLocation,
    savedAddressCount,
    location,
    savingAddress,
    handleSaveCurrentLocation,
    logout,
    isDarkMode,
    toggleTheme,
    handleDeleteAccount,
    profileStats,
    avatarUrl,
  };
};
