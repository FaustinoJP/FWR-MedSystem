import { request } from '@/lib/api';

export type Triage = {
  id: string;
  appointmentId: string;
  weight?: number | null;
  height?: number | null;
  temperature?: number | null;
  bloodPressure?: string | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTriagePayload = {
  weight?: number;
  height?: number;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  notes?: string;
};

export const triageService = {
  getByAppointment(appointmentId: string) {
    return request<Triage>(`/triage/${appointmentId}`);
  },

  create(appointmentId: string, payload: CreateTriagePayload) {
    return request<Triage>(`/triage/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(appointmentId: string, payload: Partial<CreateTriagePayload>) {
    return request<Triage>(`/triage/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};