import { request } from '@/lib/api';

export type Doctor = {
  id: string;
  name: string;
};

export const doctorsService = {
  list() {
    return request<Doctor[]>('/doctors');
  },
};