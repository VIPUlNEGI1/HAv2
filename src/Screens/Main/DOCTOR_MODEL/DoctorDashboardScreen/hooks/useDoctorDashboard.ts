import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

export interface DoctorStats {
  totalAppointments: number;
  totalEarnings: number;
  activePatients: number;
  upcomingAppointments: number;
}

export interface RecentAppointment {
  id: string;
  patient_name?: string;
  appointment_date?: string;
  appointment_time?: string;
  type?: string;
  status?: string;
}

const DEFAULT_STATS: DoctorStats = {
  totalAppointments: 0,
  totalEarnings: 0,
  activePatients: 0,
  upcomingAppointments: 0,
};

export const useDoctorDashboard = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<DoctorStats>(DEFAULT_STATS);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    const [appRes, payRes, patientsRes] = await Promise.all([
      APICall<{ data?: Array<{ _id?: string; patient?: { name?: string }; appointment_date?: string; appointment_time?: string; type?: string; status?: string }>; total?: number }>(
        'get',
        { status: 'all', limit: '10', page: '1' },
        ApiRoutes.doctors.appointments,
        {},
        token
      ),
      APICall<{ data?: Array<{ amount?: number }>; summary?: { total_earnings?: number } }>(
        'get',
        { period: 'month', type: 'in' },
        ApiRoutes.doctors.payments,
        {},
        token
      ),
      APICall<{ data?: Array<unknown>; total?: number }>(
        'get',
        { limit: '100' },
        ApiRoutes.doctors.patients,
        {},
        token
      ),
    ]);

    const appointments = (appRes.status === 200 && Array.isArray(appRes.data?.data)) ? appRes.data!.data : [];
    const payments = (payRes.status === 200 && Array.isArray((payRes.data as any)?.data)) ? (payRes.data as any).data : [];
    const patients = (patientsRes.status === 200 && Array.isArray(patientsRes.data?.data)) ? patientsRes.data!.data : [];
    const summary = (payRes.data as any)?.summary ?? {};
    const totalCount = (appRes.data as any)?.total ?? appointments.length;

    setStats({
      totalAppointments: totalCount,
      totalEarnings: summary.total_earnings ?? payments.reduce((s: number, p: { amount?: number }) => s + (p.amount ?? 0), 0),
      activePatients: (patientsRes.data as any)?.total ?? patients.length,
      upcomingAppointments: appointments.filter((a: { status?: string }) => a.status === 'pending' || a.status === 'confirmed').length,
    });

    setRecentAppointments(
      appointments.slice(0, 5).map((a: { _id?: string; patient?: { name?: string }; appointment_date?: string; appointment_time?: string; type?: string; status?: string }) => ({
        id: String(a._id ?? ''),
        patient_name: a.patient?.name,
        appointment_date: a.appointment_date,
        appointment_time: a.appointment_time,
        type: a.type,
        status: a.status,
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
    recentAppointments,
    loading,
    refreshing,
    handleRefresh,
  };
};
