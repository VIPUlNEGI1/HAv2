import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { launchImageLibrary, launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface ImagePickerButtonProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  onImageRemoved?: () => void;
  label?: string;
  multiple?: boolean;
}

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  imageUri,
  onImageSelected,
  onImageRemoved,
  label = 'Add Image',
  multiple = false,
}) => {
  const { theme, shadows } = useTheme();

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        saveToPhotos: false,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          onImageSelected(response.assets[0].uri || '');
        }
      }
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        selectionLimit: multiple ? 10 : 1,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          onImageSelected(response.assets[0].uri || '');
        }
      }
    );
  };

  if (imageUri) {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {onImageRemoved && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onImageRemoved}
            activeOpacity={0.8}
          >
            <X size={moderateScale(16)} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.pickerButton, { backgroundColor: theme.surface, borderColor: theme.border, ...shadows }]}
      onPress={handleImagePicker}
      activeOpacity={0.7}
    >
      <ImageIcon size={moderateScale(24)} color={theme.primary} />
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Camera size={moderateScale(18)} color={theme.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  label: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: verticalScale(200),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
