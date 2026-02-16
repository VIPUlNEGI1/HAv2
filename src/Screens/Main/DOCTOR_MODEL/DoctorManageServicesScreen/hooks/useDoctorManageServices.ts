import { useState } from 'react';

export interface Service {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'chat';
  price: number;
  duration: number;
  enabled: boolean;
  description: string;
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'Video Consultation', type: 'video', price: 1000, duration: 30, enabled: true, description: 'Face-to-face video consultation' },
  { id: '2', name: 'Audio Consultation', type: 'audio', price: 800, duration: 30, enabled: true, description: 'Voice call consultation' },
  { id: '3', name: 'Chat Consultation', type: 'chat', price: 500, duration: 0, enabled: true, description: 'Text-based consultation' },
];

const INITIAL_SLOTS: TimeSlot[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: '2', day: 'Tuesday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: '3', day: 'Wednesday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: '4', day: 'Thursday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: '5', day: 'Friday', startTime: '09:00', endTime: '17:00', enabled: true },
  { id: '6', day: 'Saturday', startTime: '10:00', endTime: '14:00', enabled: true },
  { id: '7', day: 'Sunday', startTime: '10:00', endTime: '14:00', enabled: false },
];

export const useDoctorManageServices = () => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>(INITIAL_SLOTS);

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const updateSlot = (id: string, updates: Partial<TimeSlot>) => {
    setAvailableSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  return { services, setServices, availableSlots, setAvailableSlots, updateService, updateSlot };
};
