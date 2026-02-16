import Geolocation from '@react-native-community/geolocation';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Beaker, Activity, Heart, FlaskConical } from 'lucide-react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

const CATEGORY_ICONS: Record<string, { icon: typeof FlaskConical; color: string }> = {
  'Full Body': { icon: FlaskConical, color: '#E0F2F1' },
  Diabetes: { icon: Activity, color: '#FFF3E0' },
  Thyroid: { icon: Beaker, color: '#F3E5F5' },
  Heart: { icon: Heart, color: '#FCE4EC' },
};

const getCategoryStyle = (cat: string) => CATEGORY_ICONS[cat] ?? { icon: FlaskConical, color: '#E0F2F1' };

export const useLabTests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedSpecialty] = useState('All');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [apiTests, setApiTests] = useState<Array<{
    id: string;
    name: string;
    category: string;
    tests: string;
    price: number;
    oldPrice: number;
    discount: string;
    labName: string;
    location: { latitude: number; longitude: number };
    rating: string;
    requirements: string[];
    icon: typeof FlaskConical;
    color: string;
    distance?: string;
  }>>([]);
  const [loadingTests, setLoadingTests] = useState(true);

  const fetchLabTests = useCallback(async () => {
    setLoadingTests(true);
    const params: Record<string, string> = {};
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    const res = await APICall<{ data?: Array<{
      _id?: string;
      name?: string;
      category?: string;
      description?: string;
      price?: number;
      lab_name?: string;
      lab_address?: string;
      location?: { latitude?: number; longitude?: number };
      rating?: number;
    }> }>('get', params, ApiRoutes.labTests.list, {}, undefined);
    if (res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      setApiTests(
        res.data.data.map((t) => {
          const cat = t.category ?? 'General';
          const style = getCategoryStyle(cat);
          const price = Number(t.price ?? 0);
          const oldPrice = Math.round(price * 1.5);
          return {
            id: String(t._id ?? ''),
            name: t.name ?? 'Lab Test',
            category: cat,
            tests: t.description ?? 'Tests included',
            price,
            oldPrice,
            discount: oldPrice > 0 ? `${Math.round((1 - price / oldPrice) * 100)}% OFF` : '',
            labName: t.lab_name ?? 'Lab',
            location: t.location?.latitude != null && t.location?.longitude != null
              ? { latitude: t.location.latitude, longitude: t.location.longitude }
              : { latitude: 0, longitude: 0 },
            rating: String(t.rating ?? 4.5),
            requirements: [],
            icon: style.icon,
            color: style.color,
          };
        })
      );
    } else {
      setApiTests([]);
    }
    setLoadingTests(false);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchLabTests();
  }, [fetchLabTests]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(apiTests.map((t) => t.category).filter(Boolean)));
    return ['All', ...cats.sort()];
  }, [apiTests]);

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
    let list = apiTests
      .filter((test) => {
        const matchesSearch =
          !searchQuery.trim() ||
          test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.labName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .map((test) => {
        const dist =
          userLocation && test.location?.latitude != null && test.location?.longitude != null
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                test.location.latitude,
                test.location.longitude
              )
            : '—';
        return { ...test, distance: dist };
      });
    if (userLocation && list.some((t) => t.distance !== '—')) {
      list = [...list].sort((a, b) => {
        const da = a.distance === '—' ? 9999 : parseFloat(a.distance);
        const db = b.distance === '—' ? 9999 : parseFloat(b.distance);
        return da - db;
      });
    }
    return list;
  }, [apiTests, searchQuery, selectedCategory, userLocation]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedSpecialty,
    categories: categories.length > 1 ? categories : ['All', 'Full Body', 'Diabetes', 'Heart', 'Thyroid'],
    filteredTests,
    loadingLocation,
    loadingTests,
    userLocation,
    onRefresh: fetchLabTests,
  };
};
