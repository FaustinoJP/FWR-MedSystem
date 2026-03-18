import { request } from '@/lib/api';
import type { CreateEncounterPayload, Encounter } from '@/types/encounter';

export const encountersService = {
  getByAppointment(appointmentId: string) {
    return request<Encounter>(`/appointments/${appointmentId}/encounter`);
  },
  create(appointmentId: string, payload: CreateEncounterPayload) {
    return request<Encounter>(`/appointments/${appointmentId}/encounter`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(appointmentId: string, payload: CreateEncounterPayload) {
    return request<Encounter>(`/appointments/${appointmentId}/encounter`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
