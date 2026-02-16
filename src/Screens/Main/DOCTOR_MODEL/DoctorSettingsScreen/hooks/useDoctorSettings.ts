import { useState } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { toast } from '@backpackapp-io/react-native-toast';

export const useDoctorSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' as MediaType, quality: 0.8, maxWidth: 800, maxHeight: 800 }, (response: ImagePickerResponse) => {
      if (response.assets?.[0]) { setProfileImage(response.assets[0].uri || null); toast.success('Profile image updated!'); }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' as MediaType, quality: 0.8, maxWidth: 800, maxHeight: 800 }, (response: ImagePickerResponse) => {
      if (response.assets?.[0]) { setProfileImage(response.assets[0].uri || null); toast.success('Profile image updated!'); }
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => toast.success('Logged out successfully') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => toast.error('Account deletion requested') },
    ]);
  };

  return {
    notificationsEnabled,
    setNotificationsEnabled,
    profileImage,
    setProfileImage,
    handleImagePicker,
    openCamera,
    openGallery,
    handleLogout,
    handleDeleteAccount,
  };
};
