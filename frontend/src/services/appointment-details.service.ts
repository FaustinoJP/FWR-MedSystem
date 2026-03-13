import { request } from '@/lib/api';
import { Appointment } from '@/types';

export const appointmentDetailsService = {
  getById(id: string) {
    return request<Appointment & {
      triage?: any | null;
      encounter?: any | null;
      Invoice?: any | null;
    }>(`/appointments/${id}`);
  },
};
