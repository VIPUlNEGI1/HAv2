import { useState, useMemo } from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Dummy data
const DUMMY_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 150, minStock: 50, unit: 'tablets', status: 'in_stock' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 30, minStock: 50, unit: 'tablets', status: 'low_stock' },
  { id: '3', name: 'Bandages', category: 'First Aid', stock: 0, minStock: 20, unit: 'pieces', status: 'out_of_stock' },
  { id: '4', name: 'Syringes 5ml', category: 'Medical Supplies', stock: 200, minStock: 100, unit: 'pieces', status: 'in_stock' },
];

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
];

export const useClinicInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(DUMMY_INVENTORY);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [inventory, selectedFilter, searchQuery]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return '#10B981';
      case 'low_stock':
        return '#F59E0B';
      case 'out_of_stock':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Get item by ID
  const getItemById = (id: string) => {
    return inventory.find((item) => item.id === id);
  };

  return {
    // Data
    inventory: filteredInventory,
    allInventory: inventory,
    statusFilters: STATUS_FILTERS,

    // Filters
    selectedFilter,
    setSelectedFilter,
    searchQuery,
    setSearchQuery,

    // Helpers
    getStatusColor,
    getItemById,

    // Loading
    loading,
    refreshing,
    handleRefresh,
  };
};
