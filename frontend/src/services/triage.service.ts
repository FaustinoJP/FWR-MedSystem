import { request } from '@/lib/api';
import type { CreateTriagePayload, Triage } from '@/types/triage';

export const triageService = {
  getByAppointment(appointmentId: string) {
    return request<Triage>(`/appointments/${appointmentId}/triage`);
  },
  create(appointmentId: string, payload: CreateTriagePayload) {
    return request<Triage>(`/appointments/${appointmentId}/triage`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(appointmentId: string, payload: CreateTriagePayload) {
    return request<Triage>(`/appointments/${appointmentId}/triage`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
