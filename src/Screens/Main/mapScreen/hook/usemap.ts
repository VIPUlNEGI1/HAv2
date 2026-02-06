import Geolocation from '@react-native-community/geolocation';
import { useCallback, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import MapView, { Region } from 'react-native-maps';

const INITIAL_REGION: Region = {
  latitude: 30.305937,
  longitude: 77.911877,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const useMap = () => {
  // hooks
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [mapReady, setMapReady] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!mapReady) return;

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const updateRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(updateRegion);

        // Move map camera smoothly
        mapRef?.current?.animateToRegion(updateRegion, 1000);
      },
      error => {
        console.log('❌ Location error:', error.code, error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [mapReady]);

  // Request runtime permission (Android)
  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      const fineGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      if (fineGranted) {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    }
  }, [getCurrentLocation]);

  // Called when user stops moving the map
  const onRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const nearbyPlaces = [
    {
      id: '1',
      name: 'Max Super Speciality Hospital',
      type: 'Hospital',
      latitude: 30.3412,
      longitude: 78.0911,
      image: 'https://images.unsplash.com/photo-1587350859728-117699f4a1ec?auto=format&fit=crop&w=200&q=80',
      services: ['Emergency', 'Cardiology', 'Neurology', '24/7 Pharmacy'],
      rating: 4.7,
      address: 'Malsi, Dehradun',
    },
    {
      id: '2',
      name: 'Apollo Diagnostics',
      type: 'Lab',
      latitude: 30.3165,
      longitude: 78.0322,
      image: 'https://images.unsplash.com/photo-1579154235602-3c20f00e422b?auto=format&fit=crop&w=200&q=80',
      services: ['Blood Test', 'X-Ray', 'MRI', 'Home Collection'],
      rating: 4.8,
      address: 'Rajpur Road, Dehradun',
    },
    {
      id: '3',
      name: 'Synergy Hospital',
      type: 'Hospital',
      latitude: 30.3321,
      longitude: 77.9982,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=200&q=80',
      services: ['Orthopedic', 'Pediatrics', 'General Surgery'],
      rating: 4.5,
      address: 'Ballupur, Dehradun',
    },
    {
      id: '4',
      name: 'MindCare Therapy Center',
      type: 'Therapist',
      latitude: 30.3244,
      longitude: 78.0465,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=200&q=80',
      services: ['Counseling', 'Physiotherapy', 'Speech Therapy'],
      rating: 4.9,
      address: 'Karanpur, Dehradun',
    },
  ];

  return {
    mapRef,
    region,
    setRegion,
    setMapReady,
    requestLocationPermission,
    onRegionChangeComplete,
    nearbyPlaces,
    calculateDistance,
  };
};
