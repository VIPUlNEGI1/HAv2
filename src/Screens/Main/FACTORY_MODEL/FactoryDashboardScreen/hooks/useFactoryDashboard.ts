import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

export interface FactoryStats {
  totalOrders: number;
  totalRevenue: number;
  activeClients: number;
  pendingShipments: number;
}

export interface RecentOrder {
  id: string;
  order_number?: string;
  status?: string;
  shipping_status?: string;
  total?: number;
}

const DEFAULT_STATS: FactoryStats = {
  totalOrders: 0,
  totalRevenue: 0,
  activeClients: 0,
  pendingShipments: 0,
};

export const useFactoryDashboard = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<FactoryStats>(DEFAULT_STATS);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    const [ordersRes, clientsRes, paymentsRes, shippingRes] = await Promise.all([
      APICall<{ data?: Array<{ _id?: string; order_number?: string; status?: string; shipping_status?: string; total?: number }>; total?: number }>(
        'get',
        { limit: '10', page: '1' },
        ApiRoutes.factories.orders,
        {},
        token
      ),
      APICall<{ data?: Array<unknown>; total?: number }>('get', { limit: '50' }, ApiRoutes.factories.clients, {}, token),
      APICall<{ data?: Array<{ amount?: number }>; summary?: { total?: number } }>(
        'get',
        { period: 'month' },
        ApiRoutes.factories.payments,
        {},
        token
      ),
      APICall<{ data?: Array<{ shipping_status?: string }>; total?: number }>(
        'get',
        { status: 'pending' },
        ApiRoutes.factories.shipping,
        {},
        token
      ),
    ]);

    const orders = (ordersRes.status === 200 && Array.isArray(ordersRes.data?.data)) ? ordersRes.data!.data : [];
    const clients = (clientsRes.status === 200 && Array.isArray(clientsRes.data?.data)) ? clientsRes.data!.data : [];
    const payments = (paymentsRes.status === 200 && Array.isArray((paymentsRes.data as any)?.data)) ? (paymentsRes.data as any).data : [];
    const shipping = (shippingRes.status === 200 && Array.isArray(shippingRes.data?.data)) ? shippingRes.data!.data : [];
    const summary = (paymentsRes.data as any)?.summary ?? {};

    setStats({
      totalOrders: (ordersRes.data as any)?.total ?? orders.length,
      totalRevenue: summary.total ?? payments.reduce((s: number, p: { amount?: number }) => s + (p.amount ?? 0), 0),
      activeClients: (clientsRes.data as any)?.total ?? clients.length,
      pendingShipments: (shippingRes.data as any)?.total ?? shipping.filter((s: { shipping_status?: string }) => s.shipping_status === 'pending').length,
    });

    setRecentOrders(
      orders.slice(0, 5).map((o: { _id?: string; order_number?: string; status?: string; shipping_status?: string; total?: number }) => ({
        id: String(o._id ?? ''),
        order_number: o.order_number,
        status: o.status,
        shipping_status: o.shipping_status,
        total: o.total,
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
