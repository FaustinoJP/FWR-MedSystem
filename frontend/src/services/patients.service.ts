import { request } from '@/lib/api';

export type Patient = {
  id: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phone?: string | null;
  bloodGroup?: string | null;
  createdAt: string;
};

export type CreatePatientPayload = {
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phone?: string;
  bloodGroup?: string;
};

export const patientsService = {
  list(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Patient[]>(`/patients${query}`);
  },

  getById(id: string) {
    return request<Patient>(`/patients/${id}`);
  },

  create(payload: CreatePatientPayload) {
    return request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<CreatePatientPayload>) {
    return request<Patient>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};