import { useState, useMemo, useCallback, useEffect } from 'react';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

const FALLBACK_DOCTORS = [
  { id: '1', name: 'Dr. Arpita Shah', specialty: 'Cardiologist', exp: '12 yrs', rating: 4.9, price: 800, image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg' },
  { id: '2', name: 'Dr. Sameer Khan', specialty: 'Dermatologist', exp: '8 yrs', rating: 4.7, price: 600, image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-with-stethoscope-around-neck-standing-with-folded-arms_409827-254.jpg' },
];

type DoctorItem = {
  id: string;
  name: string;
  specialty: string;
  exp: string;
  rating: number;
  price: number;
  image: string;
};

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorItem[]>(FALLBACK_DOCTORS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '50' };
    if (selectedSpecialty && selectedSpecialty !== 'All') params.specialization = selectedSpecialty;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (minRating > 0) params.minRating = String(minRating);
    if (maxPrice < 2000) params.maxPrice = String(maxPrice);
    const res = await APICall<{ data?: Array<{
      _id?: string;
      user_id?: { name?: string; avatar_url?: string };
      specialization?: string;
      experience_years?: number;
      consultation_fee?: number;
      rating?: number;
    }> }>('get', params, ApiRoutes.doctors.list, {}, undefined);

    if (res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      setDoctors(
        res.data.data.map((d) => {
          const user = d.user_id as { name?: string; avatar_url?: string } | undefined;
          const name = user?.name ?? d.specialization ?? 'Doctor';
          return {
            id: String(d._id ?? ''),
            name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
            specialty: d.specialization ?? 'General',
            exp: `${d.experience_years ?? 0} yrs`,
            rating: Number(d.rating ?? 4.5),
            price: Number(d.consultation_fee ?? 0),
            image: user?.avatar_url ?? 'https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope_23-2147661402.jpg',
          };
        })
      );
    } else {
      setDoctors(FALLBACK_DOCTORS);
    }
    setLoading(false);
  }, [selectedSpecialty, searchQuery, minRating, maxPrice]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch = !searchQuery.trim() || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesPrice = doc.price <= maxPrice;
      const matchesRating = doc.rating >= minRating;
      return matchesSearch && matchesSpecialty && matchesPrice && matchesRating;
    });
  }, [doctors, searchQuery, selectedSpecialty, maxPrice, minRating]);

  const specialties = useMemo(() => {
    const specs = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean)));
    return ['All', ...specs.sort()];
  }, [doctors]);

  return {
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    filteredDoctors,
    specialties: specialties.length > 1 ? specialties : ['All', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'General Physician'],
    loading,
    onRefresh: fetchDoctors,
  };
};
