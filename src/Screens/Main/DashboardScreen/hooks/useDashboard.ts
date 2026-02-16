import { useState, useCallback, useEffect } from 'react';
import { Pill, User, Activity, Calendar } from 'lucide-react-native';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

const STATIC_CATEGORIES = [
  { id: '1', slug: 'medicine', title: 'Medicines', icon: Pill, color: '#10B981', screen: 'MedicineScreen' },
  { id: '2', slug: 'doctor', title: 'Doctors', icon: User, color: '#6366F1', screen: 'DoctorsScreen' },
  { id: '3', slug: 'lab_test', title: 'Lab Tests', icon: Activity, color: '#F59E0B', screen: 'LabTestsScreen' },
  { id: '4', slug: 'appointment', title: 'Appointments', icon: Calendar, color: '#EC4899', screen: 'AppointmentsScreen' },
  { id: '5', slug: 'wellness', title: 'Wellness', icon: Activity, color: '#8B5CF6', screen: 'WellnessScreen' },
  { id: '6', slug: 'ayurveda', title: 'Ayurveda', icon: Pill, color: '#059669', screen: 'AyurvedaScreen' },
  { id: '7', slug: 'home_care', title: 'Home Care', icon: User, color: '#06B6D4', screen: 'HomeCareScreen' },
  { id: '8', slug: 'baby_care', title: 'Baby Care', icon: Activity, color: '#F43F5E', screen: 'BabyCareScreen' },
];

const FALLBACK_OFFER = {
  id: 'fallback',
  title: 'Healthcare at your fingertips',
  subtitle: 'Book appointments, order medicines & lab tests',
  image: 'https://img.freepik.com/free-vector/healthcare-medical-concept-with-pills-capsules_1017-32321.jpg',
  image_url: 'https://img.freepik.com/free-vector/healthcare-medical-concept-with-pills-capsules_1017-32321.jpg',
  bgColor: '#059669',
  gradient: ['#10B981', '#059669'],
};

export const useDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [offers, setOffers] = useState<typeof FALLBACK_OFFER[]>([]);
  const [categories, setCategories] = useState(STATIC_CATEGORIES);

  const fetchBanners = useCallback(async () => {
    const res = await APICall<{ data?: Array<{
      _id?: string;
      id?: string;
      title?: string;
      subtitle?: string;
      description?: string;
      image_url?: string;
      bg_color?: string;
      gradient?: string[];
      link_type?: string;
      link_id?: string;
      link_url?: string;
    }> }>('get', { role: 'user', limit: '10' }, ApiRoutes.banners.list, {}, undefined);
    if (res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      setOffers(
        res.data.data.map((b) => ({
          id: b._id ?? b.id ?? '',
          title: b.title ?? 'Offer',
          subtitle: b.subtitle ?? b.description ?? '',
          image: b.image_url ?? FALLBACK_OFFER.image,
          image_url: b.image_url ?? FALLBACK_OFFER.image,
          bgColor: b.bg_color ?? '#059669',
          gradient: Array.isArray(b.gradient) && b.gradient.length >= 2 ? b.gradient : ['#10B981', '#059669'],
        }))
      );
    } else {
      setOffers([FALLBACK_OFFER]);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await APICall<{ data?: Array<{ _id?: string; slug?: string; name?: string; type?: string }> }>(
      'get',
      { type: 'general', is_active: 'true' },
      ApiRoutes.categories.list,
      {},
      undefined
    );
    if (res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      const catMap: Record<string, string> = {
        medicine: 'MedicineScreen',
        service: 'DoctorsScreen',
        wellness: 'WellnessScreen',
        ayurveda: 'AyurvedaScreen',
        baby_care: 'BabyCareScreen',
        home_care: 'HomeCareScreen',
        lab_test: 'LabTestsScreen',
      };
      const mapped = res.data.data.map((c, i) => {
        const slug = c.slug ?? c.type ?? String(c._id);
        const staticCat = STATIC_CATEGORIES[i] ?? STATIC_CATEGORIES[0];
        return {
          id: c._id ?? String(i + 1),
          slug,
          title: c.name ?? staticCat.title,
          icon: staticCat.icon,
          color: staticCat.color,
          screen: catMap[slug] ?? staticCat.screen,
        };
      });
      setCategories(mapped.length > 0 ? mapped : STATIC_CATEGORIES);
    }
  }, []);

  const load = useCallback(async () => {
    await Promise.all([fetchBanners(), fetchCategories()]);
  }, [fetchBanners, fetchCategories]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return {
    refreshing,
    onRefresh,
    categories,
    offers,
  };
};
