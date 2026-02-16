import { useState, useEffect, useCallback } from 'react';
import { useAPICall } from '@/hooks/useAPICall';
import { ApiRoutes } from '@/api/routes';
import { useRoleStore } from '@/hooks/useRoleStore';

export interface ClinicProfile {
  id: string;
  clinicName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  avatar?: string;
  bio?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

function mapApiToProfile(data: Record<string, unknown> | null): ClinicProfile {
  if (!data) {
    return {
      id: '',
      clinicName: '',
      email: '',
      phone: '',
      address: '',
      licenseNumber: '',
    };
  }
  const user = (data.user_id as Record<string, unknown>) || {};
  return {
    id: (data._id as string) || '',
    clinicName: (data.clinic_name as string) || '',
    email: (data.email as string) || (user.email as string) || '',
    phone: (data.phone as string) || (user.phone_number as string) || '',
    address: (data.address as string) || '',
    licenseNumber: (data.license_number as string) || '',
    avatar: data.avatar_url as string | undefined,
    bio: data.bio as string | undefined,
    city: data.city as string | undefined,
    state: data.state as string | undefined,
    pincode: data.pincode as string | undefined,
  };
}

export const useClinicProfile = () => {
  const { APICall } = useAPICall();
  const currentRole = useRoleStore((s) => s.currentRole);
  const [profile, setProfile] = useState<ClinicProfile>({
    id: '',
    clinicName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (currentRole !== 'clinic') return;
    setLoading(true);
    setError(null);
    const res = await APICall<{ success?: boolean; data?: Record<string, unknown> }>(
      'get',
      null,
      ApiRoutes.clinics.profile,
    );
    setLoading(false);
    if (res.status === 200 && res.data?.data) {
      setProfile(mapApiToProfile(res.data.data as Record<string, unknown>));
    } else if (res.status === 404) {
      setProfile(mapApiToProfile(null));
    } else {
      setError((res.data as { message?: string })?.message || 'Failed to load profile');
    }
  }, [APICall, currentRole]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<ClinicProfile>) => {
    if (currentRole !== 'clinic') return;
    setSaving(true);
    setError(null);
    const body: Record<string, unknown> = {};
    if (updates.clinicName !== undefined) body.clinic_name = updates.clinicName;
    if (updates.email !== undefined) body.email = updates.email;
    if (updates.phone !== undefined) body.phone = updates.phone;
    if (updates.address !== undefined) body.address = updates.address;
    if (updates.licenseNumber !== undefined) body.license_number = updates.licenseNumber;
    if (updates.bio !== undefined) body.bio = updates.bio;
    if (updates.city !== undefined) body.city = updates.city;
    if (updates.state !== undefined) body.state = updates.state;
    if (updates.pincode !== undefined) body.pincode = updates.pincode;

    const res = await APICall<{ success?: boolean; data?: Record<string, unknown> }>(
      'put',
      body,
      ApiRoutes.clinics.profile,
    );
    setSaving(false);
    if (res.status === 200 && res.data?.data) {
      setProfile(mapApiToProfile(res.data.data as Record<string, unknown>));
    } else {
      setError((res.data as { message?: string })?.message || 'Failed to update profile');
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
};
