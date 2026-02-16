import { useState, useMemo } from 'react';

export interface Client {
  id: string;
  name: string;
  type: 'clinic' | 'hospital' | 'pharmacy';
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

// Dummy data - In production, this will come from API
const DUMMY_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'City Clinic Pharmacy',
    type: 'clinic',
    location: 'Sector 18, Noida',
    totalOrders: 45,
    totalSpent: 1250000,
    lastOrderDate: '2024-02-05',
    status: 'active',
  },
  {
    id: '2',
    name: 'Health Plus Hospital',
    type: 'hospital',
    location: 'Sector 20, Noida',
    totalOrders: 120,
    totalSpent: 3500000,
    lastOrderDate: '2024-02-06',
    status: 'active',
  },
  {
    id: '3',
    name: 'MediCare Distributors',
    type: 'pharmacy',
    location: 'Sector 63, Noida',
    totalOrders: 28,
    totalSpent: 850000,
    lastOrderDate: '2024-01-28',
    status: 'active',
  },
  {
    id: '4',
    name: 'Apollo Pharmacy',
    type: 'pharmacy',
    location: 'Sector 62, Noida',
    totalOrders: 15,
    totalSpent: 450000,
    lastOrderDate: '2024-01-15',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Max Healthcare Clinic',
    type: 'clinic',
    location: 'Sector 19, Noida',
    totalOrders: 67,
    totalSpent: 2100000,
    lastOrderDate: '2024-02-07',
    status: 'active',
  },
];

const CLIENT_TYPES: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Clinic', value: 'clinic' },
  { label: 'Hospital', value: 'hospital' },
  { label: 'Pharmacy', value: 'pharmacy' },
];

const STATUS_FILTERS: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const useFactoryClients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter clients based on search, type, and status
  const filteredClients = useMemo(() => {
    return DUMMY_CLIENTS.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || client.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getClientById = (id: string) => {
    return DUMMY_CLIENTS.find((client) => client.id === id);
  };

  return {
    // Data
    clients: filteredClients,
    allClients: DUMMY_CLIENTS,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Filters
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    clientTypes: CLIENT_TYPES,
    statusFilters: STATUS_FILTERS,
    
    // Loading states
    loading,
    refreshing,
    handleRefresh,
    
    // Helpers
    getClientById,
  };
};
