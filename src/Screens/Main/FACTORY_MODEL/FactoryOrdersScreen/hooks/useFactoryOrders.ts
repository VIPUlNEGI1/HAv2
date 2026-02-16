import { useState, useMemo } from 'react';

export interface FactoryOrder {
  id: string;
  clientName: string;
  items: number;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  type: 'regular' | 'bulk';
  shippingStatus?: 'not_shipped' | 'preparing' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

// Dummy data
const DUMMY_ORDERS: FactoryOrder[] = [
  {
    id: '1',
    clientName: 'City Clinic Pharmacy',
    items: 500,
    amount: 25000,
    date: 'Today',
    status: 'processing',
    type: 'bulk',
    shippingStatus: 'preparing',
  },
  {
    id: '2',
    clientName: 'Health Plus Hospital',
    items: 1000,
    amount: 50000,
    date: 'Yesterday',
    status: 'shipped',
    type: 'bulk',
    shippingStatus: 'shipped',
    trackingNumber: 'TRK-2024-001234',
  },
  {
    id: '3',
    clientName: 'MediCare Distributors',
    items: 750,
    amount: 37500,
    date: '2 days ago',
    status: 'completed',
    type: 'bulk',
    shippingStatus: 'delivered',
  },
  {
    id: '4',
    clientName: 'ABC Hospital',
    items: 200,
    amount: 10000,
    date: '3 days ago',
    status: 'pending',
    type: 'regular',
    shippingStatus: 'not_shipped',
  },
  {
    id: '5',
    clientName: 'Max Healthcare',
    items: 300,
    amount: 15000,
    date: '4 days ago',
    status: 'completed',
    type: 'regular',
    shippingStatus: 'delivered',
  },
];

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Completed', value: 'completed' },
];

export const useFactoryOrders = () => {
  const [orders, setOrders] = useState<FactoryOrder[]>(DUMMY_ORDERS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
      const matchesSearch =
        order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [orders, selectedFilter, searchQuery]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'shipped':
        return '#3B82F6';
      case 'processing':
        return '#F59E0B';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  // Get shipping color
  const getShippingColor = (status?: string) => {
    switch (status) {
      case 'delivered':
        return '#10B981';
      case 'shipped':
        return '#3B82F6';
      case 'preparing':
        return '#F59E0B';
      case 'not_shipped':
        return '#64748B';
      default:
        return '#64748B';
    }
  };

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
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
    getShippingColor,
    getOrderById,

    // Loading
    loading,
    refreshing,
    handleRefresh,
  };
};
