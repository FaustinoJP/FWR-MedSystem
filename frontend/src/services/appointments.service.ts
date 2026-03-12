import { request } from '@/lib/api';
import { Appointment } from '@/types';

export const appointmentsService = {
  list(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Appointment[]>(`/appointments${query}`);
  },
};
