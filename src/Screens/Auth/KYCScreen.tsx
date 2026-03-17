import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { Camera, MapPin, CheckCircle } from 'lucide-react-native';
import { AuthTheme } from '@/Theme/AuthTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { useAuthStore } from '@/hooks/useAuthStore';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';
import type { UserLocation } from '@/types';

const MAX_IMAGE_SIZE = 800;

const KYCScreen = () => {
  const { user, token, updateUser, setAuth } = useAuthStore();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const capturePhoto = useCallback(() => {
    Alert.alert('Profile photo', 'Take a photo or choose from gallery', [
      {
        text: 'Camera',
        onPress: () => {
          launchCamera(
            {
              mediaType: 'photo' as MediaType,
              quality: 0.8,
              maxWidth: MAX_IMAGE_SIZE,
              maxHeight: MAX_IMAGE_SIZE,
              includeBase64: true,
            },
            (res: ImagePickerResponse) => {
              if (res.assets?.[0]) {
                const asset = res.assets[0];
                setPhotoUri(asset.uri ?? null);
                setPhotoBase64(asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null);
                setLocationError(null);
              }
            },
          );
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          launchImageLibrary(
            {
              mediaType: 'photo' as MediaType,
              quality: 0.8,
              maxWidth: MAX_IMAGE_SIZE,
              maxHeight: MAX_IMAGE_SIZE,
              includeBase64: true,
            },
            (res: ImagePickerResponse) => {
              if (res.assets?.[0]) {
                const asset = res.assets[0];
                setPhotoUri(asset.uri ?? null);
                setPhotoBase64(asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null);
                setLocationError(null);
              }
            },
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, []);

  const captureLocation = useCallback(async () => {
    setLoadingLocation(true);
    setLocationError(null);

    const doGetPosition = () => {
      Geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (err) => {
          setLocationError(err?.message || 'Could not get location. Please enable location and try again.');
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location required',
          message: 'This app needs your location for KYC verification.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        doGetPosition();
      } else {
        setLocationError('Location permission denied.');
        setLoadingLocation(false);
      }
    } else {
      Geolocation.requestAuthorization();
      doGetPosition();
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!photoBase64 || !photoUri) {
      Alert.alert('Required', 'Please add your profile photo.');
      return;
    }
    if (!location?.latitude || !location?.longitude) {
      Alert.alert('Required', 'Please capture your location.');
      return;
    }
    if (!token) {
      Alert.alert('Error', 'Session expired. Please log in again.');
      return;
    }

    setSubmitting(true);
    try {
      let avatarUrl: string | undefined;
      const uploadRes = await APICall<{ data?: { avatar_url?: string } }>(
        'post',
        { image_url: photoBase64 },
        ApiRoutes.profile.uploadImage,
        {},
        token,
      );
      if (uploadRes.status === 200 && uploadRes.data?.data?.avatar_url) {
        avatarUrl = uploadRes.data.data.avatar_url;
      }
      // If upload failed, do not send base64 in profile update (keeps request small and avoids network/body issues)
      const profilePayload: Record<string, unknown> = {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          city: location.city,
          state: location.state,
          pincode: location.pincode,
        },
        kyc_status: 'verified',
      };
      if (avatarUrl) {
        profilePayload.avatar_url = avatarUrl;
      }

      const profileRes = await APICall<{ data?: { avatar_url?: string; location?: UserLocation; kyc_status?: string } }>(
        'put',
        profilePayload,
        ApiRoutes.auth.profile,
        {},
        token,
      );

      if (profileRes.status === 200 && profileRes.data?.data) {
        const data = profileRes.data.data;
        const updatedUser = {
          ...user,
          avatar_url: data.avatar_url ?? avatarUrl ?? user?.avatar_url,
          location: data.location ?? location,
          kyc_status: 'verified' as const,
        };
        setAuth(updatedUser as any, token);
      } else {
        const msg = (profileRes.data as { message?: string })?.message || 'Could not complete verification. Check your connection and try again.';
        Alert.alert('Error', msg);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  }, [photoBase64, photoUri, location, token, user, setAuth]);

  const hasPhoto = !!photoUri;
  const hasLocation = !!(location?.latitude && location?.longitude);
  const canSubmit = hasPhoto && hasLocation && !submitting;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...AuthTheme.gradient]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verify your identity</Text>
        <Text style={styles.headerSubtitle}>
          Add your profile photo and location. Required for all users.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo */}
        <Animated.View entering={FadeInDown.duration(320).springify()} style={styles.section}>
          <Text style={styles.label}>Profile photo *</Text>
          <TouchableOpacity
            onPress={capturePhoto}
            activeOpacity={0.9}
            style={[
              styles.photoWrap,
              {
                backgroundColor: AuthTheme.iconCircleBg,
                borderRadius: moderateScale(20),
                borderWidth: 2,
                borderColor: hasPhoto ? AuthTheme.ctaButtonBg : 'rgba(255,255,255,0.3)',
                borderStyle: hasPhoto ? 'solid' : 'dashed',
              },
            ]}
          >
            {hasPhoto && photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={moderateScale(48)} color={AuthTheme.textOnGradientSecondary} strokeWidth={1.5} />
                <Text style={styles.photoHint}>Tap to add photo</Text>
                <Text style={styles.photoSubhint}>Camera or gallery</Text>
              </View>
            )}
            {hasPhoto && (
              <View style={styles.checkBadge}>
                <CheckCircle size={moderateScale(20)} color={AuthTheme.ctaButtonBg} fill={AuthTheme.ctaButtonBg} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Location */}
        <Animated.View entering={FadeInDown.delay(80).duration(320).springify()} style={styles.section}>
          <Text style={styles.label}>Your location *</Text>
          <TouchableOpacity
            onPress={captureLocation}
            disabled={loadingLocation}
            activeOpacity={0.9}
            style={[
              styles.locationBtn,
              {
                backgroundColor: AuthTheme.iconCircleBg,
                borderRadius: moderateScale(16),
                borderWidth: 2,
                borderColor: hasLocation ? AuthTheme.ctaButtonBg : 'rgba(255,255,255,0.3)',
              },
            ]}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color={AuthTheme.textOnGradient} />
            ) : hasLocation ? (
              <View style={styles.locationContent}>
                <MapPin size={moderateScale(24)} color={AuthTheme.ctaButtonBg} />
                <View style={styles.locationTextWrap}>
                  <Text style={styles.locationTitle}>Location captured</Text>
                  <Text style={styles.locationCoords}>
                    {location?.latitude?.toFixed(5)}, {location?.longitude?.toFixed(5)}
                  </Text>
                </View>
                <CheckCircle size={moderateScale(22)} color={AuthTheme.ctaButtonBg} fill={AuthTheme.ctaButtonBg} />
              </View>
            ) : (
              <View style={styles.locationPlaceholder}>
                <MapPin size={moderateScale(32)} color={AuthTheme.textOnGradientSecondary} strokeWidth={1.5} />
                <Text style={styles.locationHint}>Tap to capture location</Text>
                <Text style={styles.locationSubhint}>We need this for your profile</Text>
              </View>
            )}
          </TouchableOpacity>
          {locationError ? (
            <Text style={styles.errorText}>{locationError}</Text>
          ) : null}
        </Animated.View>

        {/* Submit */}
        <Animated.View entering={FadeInUp.delay(160).duration(320).springify()} style={styles.footer}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.9}
            style={[
              styles.ctaButton,
              {
                backgroundColor: AuthTheme.ctaButtonBg,
                borderRadius: moderateScale(14),
                opacity: canSubmit ? 1 : 0.6,
              },
            ]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={AuthTheme.ctaButtonText} />
            ) : (
              <Text style={[styles.ctaButtonText, { color: AuthTheme.ctaButtonText }]}>
                Complete verification
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: moderateScale(24),
    paddingTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(40),
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: AuthTheme.textOnGradient,
    letterSpacing: 0.2,
    marginBottom: verticalScale(8),
  },
  headerSubtitle: {
    fontSize: moderateScale(15),
    color: AuthTheme.textOnGradientSecondary,
    lineHeight: 22,
  },
  scroll: {
    paddingHorizontal: moderateScale(24),
    paddingBottom: verticalScale(48),
  },
  section: { marginBottom: verticalScale(24) },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: AuthTheme.textOnGradient,
    marginBottom: verticalScale(10),
  },
  photoWrap: {
    width: moderateScale(140),
    height: moderateScale(140),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: AuthTheme.textOnGradient,
    marginTop: verticalScale(8),
  },
  photoSubhint: {
    fontSize: moderateScale(12),
    color: AuthTheme.textOnGradientSecondary,
    marginTop: 2,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  locationBtn: {
    padding: moderateScale(20),
    minHeight: verticalScale(80),
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  locationTextWrap: { flex: 1 },
  locationTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: AuthTheme.textOnGradient,
  },
  locationCoords: {
    fontSize: moderateScale(13),
    color: AuthTheme.textOnGradientSecondary,
    marginTop: 2,
  },
  locationPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationHint: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: AuthTheme.textOnGradient,
    marginTop: verticalScale(10),
  },
  locationSubhint: {
    fontSize: moderateScale(12),
    color: AuthTheme.textOnGradientSecondary,
    marginTop: 2,
  },
  errorText: {
    fontSize: moderateScale(13),
    color: AuthTheme.error,
    marginTop: verticalScale(8),
    paddingHorizontal: 4,
  },
  footer: { marginTop: verticalScale(24) },
  ctaButton: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});

export default KYCScreen;
