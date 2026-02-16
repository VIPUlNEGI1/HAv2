import { useState, useEffect, useCallback } from 'react';
import { useAPICall } from '@/hooks/useAPICall';
import { ApiRoutes } from '@/api/routes';
import { useRoleStore } from '@/hooks/useRoleStore';

export interface FactoryProfile {
  id: string;
  factoryName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  avatar?: string;
  bio?: string;
  city?: string;
  state?: string;
  pincode?: string;
  minOrderQuantity?: number;
}

function mapApiToProfile(data: Record<string, unknown> | null): FactoryProfile {
  if (!data) {
    return {
      id: '',
      factoryName: '',
      email: '',
      phone: '',
      address: '',
      licenseNumber: '',
    };
  }
  const user = (data.user_id as Record<string, unknown>) || {};
  return {
    id: (data._id as string) || '',
    factoryName: (data.factory_name as string) || '',
    email: (data.email as string) || (user.email as string) || '',
    phone: (data.phone as string) || (user.phone_number as string) || '',
    address: (data.address as string) || '',
    licenseNumber: (data.license_number as string) || '',
    avatar: data.avatar_url as string | undefined,
    bio: data.bio as string | undefined,
    city: data.city as string | undefined,
    state: data.state as string | undefined,
    pincode: data.pincode as string | undefined,
    minOrderQuantity: data.min_order_quantity as number | undefined,
  };
}

export const useFactoryProfile = () => {
  const { APICall } = useAPICall();
  const currentRole = useRoleStore((s) => s.currentRole);
  const [profile, setProfile] = useState<FactoryProfile>({
    id: '',
    factoryName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (currentRole !== 'factory') return;
    setLoading(true);
    setError(null);
    const res = await APICall<{ success?: boolean; data?: Record<string, unknown> }>(
      'get',
      null,
      ApiRoutes.factories.profile,
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

  const updateProfile = async (updates: Partial<FactoryProfile>) => {
    if (currentRole !== 'factory') return;
    setSaving(true);
    setError(null);
    const body: Record<string, unknown> = {};
    if (updates.factoryName !== undefined) body.factory_name = updates.factoryName;
    if (updates.email !== undefined) body.email = updates.email;
    if (updates.phone !== undefined) body.phone = updates.phone;
    if (updates.address !== undefined) body.address = updates.address;
    if (updates.licenseNumber !== undefined) body.license_number = updates.licenseNumber;
    if (updates.bio !== undefined) body.bio = updates.bio;
    if (updates.city !== undefined) body.city = updates.city;
    if (updates.state !== undefined) body.state = updates.state;
    if (updates.pincode !== undefined) body.pincode = updates.pincode;
    if (updates.minOrderQuantity !== undefined) body.min_order_quantity = updates.minOrderQuantity;

    const res = await APICall<{ success?: boolean; data?: Record<string, unknown> }>(
      'put',
      body,
      ApiRoutes.factories.profile,
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
