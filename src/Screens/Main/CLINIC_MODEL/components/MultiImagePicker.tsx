import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { launchImageLibrary, launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

interface MultiImagePickerProps {
  images: string[];
  onImagesSelected: (uris: string[]) => void;
  maxImages?: number;
  label?: string;
}

export const MultiImagePicker: React.FC<MultiImagePickerProps> = ({
  images,
  onImagesSelected,
  maxImages = 4,
  label = 'Add Images (1-4)',
}) => {
  const { theme, shadows } = useTheme();

  const handleImagePicker = () => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      Alert.alert('Maximum Images', `You can only add up to ${maxImages} images.`);
      return;
    }

    Alert.alert(
      'Select Images',
      `Choose up to ${remainingSlots} image${remainingSlots > 1 ? 's' : ''}`,
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
        if (response.assets && response.assets[0] && response.assets[0].uri) {
          const newImages = [...images, response.assets[0].uri];
          if (newImages.length <= maxImages) {
            onImagesSelected(newImages);
          }
        }
      }
    );
  };

  const openGallery = () => {
    const remainingSlots = maxImages - images.length;
    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        selectionLimit: remainingSlots,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets.length > 0) {
          const newUris = response.assets
            .map(asset => asset.uri)
            .filter((uri): uri is string => uri !== undefined);
          const newImages = [...images, ...newUris].slice(0, maxImages);
          onImagesSelected(newImages);
        }
      }
    );
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesSelected(newImages);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      
      {images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesContainer}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                activeOpacity={0.8}
              >
                <X size={moderateScale(16)} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {images.length < maxImages && (
        <TouchableOpacity
          style={[styles.pickerButton, { backgroundColor: theme.surface, borderColor: theme.border, ...shadows }]}
          onPress={handleImagePicker}
          activeOpacity={0.7}
        >
          <ImageIcon size={moderateScale(24)} color={theme.primary} />
          <Text style={[styles.pickerText, { color: theme.text }]}>
            Add Image ({images.length}/{maxImages})
          </Text>
          <Camera size={moderateScale(18)} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  imagesContainer: {
    gap: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  imageWrapper: {
    position: 'relative',
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: moderateScale(4),
    right: moderateScale(4),
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: moderateScale(12),
  },
  pickerText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});
