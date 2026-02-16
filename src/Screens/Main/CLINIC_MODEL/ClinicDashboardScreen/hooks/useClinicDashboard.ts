import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

export interface ClinicStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeFactories: number;
}

export interface RecentOrder {
  id: string;
  order_number?: string;
  status?: string;
  total?: number;
  created_at?: string;
}

const DEFAULT_STATS: ClinicStats = {
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  activeFactories: 0,
};

export const useClinicDashboard = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<ClinicStats>(DEFAULT_STATS);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    const [productsRes, ordersRes, factoriesRes] = await Promise.all([
      APICall<{ data?: Array<unknown>; total?: number }>('get', { limit: '100' }, ApiRoutes.clinics.products, {}, token),
      APICall<{ data?: Array<{ _id?: string; order_number?: string; status?: string; total?: number; created_at?: string }>; total?: number }>(
        'get',
        { limit: '10', page: '1' },
        ApiRoutes.clinics.orders,
        {},
        token
      ),
      APICall<{ data?: Array<unknown>; total?: number }>('get', { limit: '50' }, ApiRoutes.clinics.factories, {}, token),
    ]);

    const products = (productsRes.status === 200 && Array.isArray(productsRes.data?.data)) ? productsRes.data!.data : [];
    const orders = (ordersRes.status === 200 && Array.isArray(ordersRes.data?.data)) ? ordersRes.data!.data : [];
    const factories = (factoriesRes.status === 200 && Array.isArray(factoriesRes.data?.data)) ? factoriesRes.data!.data : [];

    const totalOrders = (ordersRes.data as any)?.total ?? orders.length;
    const totalRevenue = orders.reduce((s: number, o: { total?: number }) => s + (o.total ?? 0), 0);

    setStats({
      totalProducts: (productsRes.data as any)?.total ?? products.length,
      totalOrders,
      totalRevenue,
      activeFactories: (factoriesRes.data as any)?.total ?? factories.length,
    });

    setRecentOrders(
      orders.slice(0, 5).map((o: { _id?: string; order_number?: string; status?: string; total?: number; created_at?: string }) => ({
        id: String(o._id ?? ''),
        order_number: o.order_number,
        status: o.status,
        total: o.total,
        created_at: o.created_at,
      }))
    );
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return {
    stats,
    recentOrders,
    loading,
    refreshing,
    handleRefresh,
  };
};
