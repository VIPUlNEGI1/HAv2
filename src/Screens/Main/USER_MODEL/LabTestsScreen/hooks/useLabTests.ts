import Geolocation from '@react-native-community/geolocation';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Beaker, Activity, Heart, Thermometer, FlaskConical } from 'lucide-react-native';
import { Platform, PermissionsAndroid } from 'react-native';

export const useLabTests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedSpecialty] = useState('All');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const categories = ['All', 'Full Body', 'Diabetes', 'Heart', 'Thyroid', 'Fever'];

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          setLoadingLocation(false);
        }
      } catch (err) {
        setLoadingLocation(false);
      }
    } else {
      getLocation();
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('📡 REAL GPS COORDINATES:', latitude, longitude);
        
        setUserLocation({
          latitude: latitude,
          longitude: longitude,
        });
        setLoadingLocation(false);
      },
      error => {
        console.log('❌ GPS TRACKING ERROR:', error.code, error.message);
        setLoadingLocation(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 20000, 
        maximumAge: 0, // Force fresh location, no cached data
        distanceFilter: 0 // Track every movement
      }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const allTests = useMemo(() => [
    { 
      id: '1', 
      name: 'Full Body Checkup', 
      category: 'Full Body',
      tests: '64 Tests included', 
      price: 799, 
      oldPrice: 1599, 
      discount: '50% OFF',
      labName: 'Apollo Diagnostics, Dehradun',
      location: { latitude: 37.421998333333335, longitude: -122.084 }, // Rajpur Road
      rating: '4.8',
      requirements: ['Fasting required (10-12 hrs)', 'Water allowed'],
      icon: FlaskConical,
      color: '#E0F2F1',
      details: [
        { title: 'Liver Function Test', count: 11 },
        { title: 'Kidney Function Test', count: 8 },
        { title: 'Lipid Profile', count: 7 },
        { title: 'Thyroid Profile', count: 3 },
        { title: 'Complete Hemogram', count: 24 }
      ]
    },
    { 
      id: '2', 
      name: 'Advanced Diabetes Screen', 
      category: 'Diabetes',
      tests: '12 Tests included', 
      price: 499, 
      oldPrice: 999, 
      discount: '50% OFF',
      labName: 'Dr. Lal PathLabs, Dehradun',
      location: { latitude: 30.3244, longitude: 78.0465 }, // Karanpur
      rating: '4.9',
      requirements: ['Fasting required (8 hrs)'],
      icon: Activity,
      color: '#FFF3E0',
      details: [
        { title: 'HbA1c', count: 1 },
        { title: 'Blood Sugar Fasting', count: 1 },
        { title: 'Urine Microalbumin', count: 1 }
      ]
    },
    { 
      id: '3', 
      name: 'Thyroid Care', 
      category: 'Thyroid',
      tests: '3 Tests included', 
      price: 399, 
      oldPrice: 799, 
      discount: '40% OFF',
      labName: 'Max Super Speciality Hospital, Dehradun',
      location: { latitude: 30.3412, longitude: 78.0911 }, // Malsi
      rating: '4.7',
      requirements: ['No fasting required'],
      icon: Beaker,
      color: '#F3E5F5',
      details: [
        { title: 'T3', count: 1 },
        { title: 'T4', count: 1 },
        { title: 'TSH Ultra-sensitive', count: 1 }
      ]
    },
    { 
      id: '4', 
      name: 'Healthy Heart Package', 
      category: 'Heart',
      tests: '15 Tests included', 
      price: 1299, 
      oldPrice: 2499, 
      discount: '48% OFF',
      labName: 'Synergy Hospital, Dehradun',
      location: { latitude: 30.3321, longitude: 77.9982 }, // Ballupur
      rating: '4.8',
      requirements: ['Fasting required (12 hrs)'],
      icon: Heart,
      color: '#FCE4EC',
      details: [
        { title: 'ECG', count: 1 },
        { title: 'Lipid Profile', count: 7 },
        { title: 'Cardiac Markers', count: 3 }
      ]
    },
  ], []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const filteredTests = useMemo(() => {
    if (!userLocation) return [];

    console.log('📍 User Location:', userLocation);

    return allTests
      .map(test => {
        const dist = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude, 
          test.location.latitude, 
          test.location.longitude
        );
        console.log(`🧪 Lab: ${test.labName}, Distance: ${dist}km`);
        return { ...test, distance: dist };
      })
      .filter(test => {
        const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             test.labName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
        
        // Increased threshold to 50km to ensure Dehradun labs show up even if user is slightly outside city center
        const isNearby = parseFloat(test.distance) < 50; 
        
        return matchesSearch && matchesCategory && isNearby;
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [allTests, searchQuery, selectedCategory, userLocation]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedSpecialty,
    categories,
    filteredTests,
    loadingLocation,
    userLocation
  };
};
