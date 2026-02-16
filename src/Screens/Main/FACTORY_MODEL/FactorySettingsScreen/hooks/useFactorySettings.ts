import { useState } from 'react';

export interface FactorySettings {
  notifications: {
    orders: boolean;
    payments: boolean;
    shipping: boolean;
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

const DEFAULT_SETTINGS: FactorySettings = {
  notifications: {
    orders: true,
    payments: true,
    shipping: true,
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

export const useFactorySettings = () => {
  const [settings, setSettings] = useState<FactorySettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  const updateSettings = async (updates: Partial<FactorySettings>) => {
    setSaving(true);
    // Simulate API call
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
