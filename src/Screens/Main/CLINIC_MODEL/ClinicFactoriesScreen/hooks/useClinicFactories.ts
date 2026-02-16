import { useState, useMemo } from 'react';

export interface Factory {
  id: string;
  name: string;
  location: string;
  rating: number;
  minOrder: number;
  productsCount: number;
}

const MOCK_FACTORIES: Factory[] = [
  {
    id: '1',
    name: 'MediPharm Industries',
    location: 'Mumbai, Maharashtra',
    rating: 4.5,
    minOrder: 100,
    productsCount: 250,
  },
  {
    id: '2',
    name: 'HealthCare Pharmaceuticals',
    location: 'Delhi, NCR',
    rating: 4.8,
    minOrder: 50,
    productsCount: 180,
  },
  {
    id: '3',
    name: 'BioMed Solutions',
    location: 'Bangalore, Karnataka',
    rating: 4.3,
    minOrder: 200,
    productsCount: 320,
  },
];

export const useClinicFactories = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFactories = useMemo(
    () =>
      MOCK_FACTORIES.filter((factory) =>
        factory.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return {
    factories: MOCK_FACTORIES,
    filteredFactories,
    searchQuery,
    setSearchQuery,
  };
};
