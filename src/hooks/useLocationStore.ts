import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  setLocation: (lat: number, lng: number) => void;
  setAddress: (address: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  address: 'Fetching location...',
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setAddress: (address) => set({ address }),
}));
