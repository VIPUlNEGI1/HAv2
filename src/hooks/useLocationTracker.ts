import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useLocationStore } from './useLocationStore';

export const useLocationTracker = () => {
  const { setLocation, setAddress } = useLocationStore();

  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return true;
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show nearby services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  useEffect(() => {
    const startTracking = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setAddress('Location permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude);
          // In a real app, you'd use reverse geocoding here
          setAddress(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
        },
        (error) => {
          console.error('Location error:', error);
          setAddress('Error fetching location');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );

      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude);
          setAddress(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
        },
        (error) => console.error('Watch error:', error),
        { enableHighAccuracy: true, distanceFilter: 10 },
      );

      return () => Geolocation.clearWatch(watchId);
    };

    startTracking();
  }, []);
};
