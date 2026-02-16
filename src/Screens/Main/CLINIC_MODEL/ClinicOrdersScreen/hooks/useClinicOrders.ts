import { useState, useMemo } from 'react';

export interface ClinicOrder {
  id: string;
  customerName: string;
  items: number;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  type: 'regular' | 'bulk';
}

// Dummy data
const DUMMY_ORDERS: ClinicOrder[] = [
  { id: '1', customerName: 'John Doe', items: 5, amount: 1250, date: 'Today', status: 'pending', type: 'regular' },
  { id: '2', customerName: 'Jane Smith', items: 12, amount: 3200, date: 'Yesterday', status: 'processing', type: 'bulk' },
  { id: '3', customerName: 'ABC Hospital', items: 50, amount: 15000, date: '2 days ago', status: 'completed', type: 'bulk' },
  { id: '4', customerName: 'Mike Johnson', items: 3, amount: 750, date: '3 days ago', status: 'completed', type: 'regular' },
];

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
];

export const useClinicOrders = () => {
  const [orders, setOrders] = useState<ClinicOrder[]>(DUMMY_ORDERS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
      const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [orders, selectedFilter, searchQuery]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'processing':
        return '#3B82F6';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
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

  // Get order by ID
  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return {
    // Data
    orders: filteredOrders,
    allOrders: orders,
    statusFilters: STATUS_FILTERS,

    // Filters
    selectedFilter,
    setSelectedFilter,
    searchQuery,
    setSearchQuery,

    // Helpers
    getStatusColor,
    getOrderById,

    // Loading
    loading,
    refreshing,
    handleRefresh,
  };
};
