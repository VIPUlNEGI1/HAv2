import { useState, useCallback, useMemo } from 'react';
import { Pill, User, Activity, Calendar } from 'lucide-react-native';

export const useDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const categories = useMemo(() => [
    { id: '1', title: 'Medicines', icon: Pill, color: '#10B981' },
    { id: '2', title: 'Doctors', icon: User, color: '#6366F1' },
    { id: '3', title: 'Lab Tests', icon: Activity, color: '#F59E0B' },
    { id: '4', title: 'Appointments', icon: Calendar, color: '#EC4899' },
    { id: '5', title: 'Wellness', icon: Activity, color: '#8B5CF6' },
    { id: '6', title: 'Ayurveda', icon: Pill, color: '#059669' },
    { id: '7', title: 'Home Care', icon: User, color: '#06B6D4' },
    { id: '8', title: 'Baby Care', icon: Activity, color: '#F43F5E' },
  ], []);

  const offers = useMemo(() => [
    {
      id: '1',
      title: 'Flat 25% OFF',
      subtitle: 'On your first medicine order',
      image: 'https://img.freepik.com/free-vector/healthcare-medical-concept-with-pills-capsules_1017-32321.jpg',
      bgColor: '#059669',
      gradient: ['#10B981', '#059669']
    },
    {
      id: '2',
      title: 'Free Health Checkup',
      subtitle: 'Limited time expert consultation',
      image: 'https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg',
      bgColor: '#4F46E5',
      gradient: ['#6366F1', '#4F46E5']
    },
  ], []);

  return {
    refreshing,
    onRefresh,
    categories,
    offers,
  };
};
