import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/Helpers/AppStorage';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  setAppointments: (appointments: Appointment[]) => void;
  cancelAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      appointments: [],
      addAppointment: (appointment) =>
        set((state) => ({ appointments: [appointment, ...state.appointments] })),
      setAppointments: (appointments) => set({ appointments }),
      cancelAppointment: (id) =>
        set((state) => ({ 
          appointments: state.appointments.filter(app => app.id !== id) 
        })),
    }),
    {
      name: 'appointment-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
