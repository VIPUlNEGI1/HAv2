import { useState } from 'react';

export interface ClinicSettings {
  notifications: {
    orders: boolean;
    payments: boolean;
    inventory: boolean;
    messages: boolean;
  };
  privacy: {
    showProfile: boolean;
    showProducts: boolean;
  };
  preferences: {
    language: string;
    currency: string;
  };
}

const DEFAULT_SETTINGS: ClinicSettings = {
  notifications: {
    orders: true,
    payments: true,
    inventory: true,
    messages: true,
  },
  privacy: {
    showProfile: true,
    showProducts: true,
  },
  preferences: {
    language: 'en',
    currency: 'INR',
  },
};

export const useClinicSettings = () => {
  const [settings, setSettings] = useState<ClinicSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  const updateSettings = async (updates: Partial<ClinicSettings>) => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSettings({ ...settings, ...updates });
    setSaving(false);
  };

  return {
    settings,
    saving,
    updateSettings,
  };
};
