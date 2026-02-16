import { useState, useMemo } from 'react';

export interface Shipping {
  id: string;
  orderNumber: string;
  clientName: string;
  items: number;
  status: 'preparing' | 'ready' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingDate?: string;
  estimatedDelivery?: string;
  address: string;
}

// Dummy data
const DUMMY_SHIPMENTS: Shipping[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001234',
    clientName: 'City Clinic Pharmacy',
    items: 500,
    status: 'preparing',
    address: 'Sector 18, Noida, UP - 201301',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-001235',
    clientName: 'Health Plus Hospital',
    items: 1000,
    status: 'ready',
    address: 'Sector 20, Noida, UP - 201301',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-001236',
    clientName: 'MediCare Distributors',
    items: 750,
    status: 'shipped',
    trackingNumber: 'TRK-2024-001236',
    shippingDate: '2024-02-05',
    estimatedDelivery: '2024-02-08',
    address: 'Sector 63, Noida, UP - 201301',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-001237',
    clientName: 'ABC Hospital',
    items: 200,
    status: 'delivered',
    trackingNumber: 'TRK-2024-001237',
    shippingDate: '2024-02-01',
    estimatedDelivery: '2024-02-04',
    address: 'Sector 62, Noida, UP - 201301',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-001238',
    clientName: 'Max Healthcare',
    items: 300,
    status: 'in_transit',
    trackingNumber: 'TRK-2024-001238',
    shippingDate: '2024-02-06',
    estimatedDelivery: '2024-02-09',
    address: 'Sector 19, Noida, UP - 201301',
  },
];

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
];

export const useFactoryShipping = () => {
  const [shipments, setShipments] = useState<Shipping[]>(DUMMY_SHIPMENTS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'preparing' | 'ready' | 'shipped' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesFilter = selectedFilter === 'all' || shipment.status === selectedFilter;
      const matchesSearch =
        shipment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [shipments, selectedFilter, searchQuery]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#10B981';
      case 'in_transit':
        return '#3B82F6';
      case 'shipped':
        return '#3B82F6';
      case 'ready':
        return '#F59E0B';
      case 'preparing':
        return '#64748B';
      case 'cancelled':
        return '#EF4444';
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

  // Get shipment by ID
  const getShipmentById = (id: string) => {
    return shipments.find((shipment) => shipment.id === id);
  };

  return {
    // Data
    shipments: filteredShipments,
    allShipments: shipments,
    statusFilters: STATUS_FILTERS,

    // Filters
    selectedFilter,
    setSelectedFilter,
    searchQuery,
    setSearchQuery,

    // Helpers
    getStatusColor,
    getShipmentById,

    // Loading
    loading,
    refreshing,
    handleRefresh,
  };
};
