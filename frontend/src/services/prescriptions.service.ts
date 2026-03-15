import { request } from '@/lib/api';
import type { CreatePrescriptionPayload, Prescription } from '@/types/prescription';

export const prescriptionsService = {
  listByAppointment(appointmentId: string) {
    return request<Prescription[]>(`/appointments/${appointmentId}/prescriptions`);
  },

  create(appointmentId: string, payload: CreatePrescriptionPayload) {
    return request<Prescription>(`/appointments/${appointmentId}/prescriptions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getById(id: string) {
    return request<Prescription>(`/prescriptions/${id}`);
  },

  update(id: string, payload: Partial<CreatePrescriptionPayload>) {
    return request<Prescription>(`/prescriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
