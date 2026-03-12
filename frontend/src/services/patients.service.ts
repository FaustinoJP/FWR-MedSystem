import { request } from '@/lib/api';
import { Patient } from '@/types';

export const patientsService = {
  list(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Patient[]>(`/patients${query}`);
  },
};
