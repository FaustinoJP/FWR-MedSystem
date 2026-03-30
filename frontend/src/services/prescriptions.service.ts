import { request } from '@/lib/api';

export type Prescription = {
  id: string;
  appointmentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  createdAt?: string;
};

export type CreatePrescriptionPayload = {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
};

export const prescriptionsService = {
  listByAppointment(appointmentId: string) {
    return request<Prescription[]>(`/prescriptions/${appointmentId}`);
  },

  create(appointmentId: string, payload: CreatePrescriptionPayload) {
    return request<Prescription>(`/prescriptions/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};