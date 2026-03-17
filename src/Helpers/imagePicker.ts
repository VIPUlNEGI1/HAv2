import { Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

const DEFAULT_OPTIONS = {
  mediaType: 'photo' as MediaType,
  quality: 0.85,
  maxWidth: 1024,
  maxHeight: 1024,
  includeBase64: false,
};

export type PickSource = 'camera' | 'gallery';

/**
 * Request camera permission on Android. No-op on iOS (handled by system when launching).
 */
export async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera permission',
        message: 'This app needs camera access to take profile photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

/**
 * Launch camera or gallery and return the selected image URI, or null if cancelled/error.
 * Handles Android camera permission and response errors.
 */
export function pickProfileImage(
  source: PickSource,
  onResult: (uri: string | null, error?: string) => void
): void {
  const runPicker = () => {
    const options = { ...DEFAULT_OPTIONS };
    const launcher = source === 'camera' ? launchCamera : launchImageLibrary;
    launcher(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        onResult(null);
        return;
      }
      if (response.errorCode) {
        const msg =
          response.errorCode === 'camera_unavailable'
            ? 'Camera is not available'
            : response.errorCode === 'permission'
              ? 'Permission denied'
              : response.errorMessage || 'Could not open picker';
        onResult(null, msg);
        return;
      }
      const uri = response.assets?.[0]?.uri ?? null;
      onResult(uri);
    });
  };

  if (source === 'camera') {
    requestCameraPermission().then((ok) => {
      if (ok) runPicker();
      else onResult(null, 'Camera permission is required to take a photo.');
    });
  } else {
    runPicker();
  }
}
