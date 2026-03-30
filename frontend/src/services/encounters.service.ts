import { request } from '@/lib/api';

export type Encounter = {
  id: string;
  appointmentId: string;
  status: string;
  chiefComplaint?: string | null;
  historyOfPresentIllness?: string | null;
  physicalExam?: string | null;
  assessment?: string | null;
  plan?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateEncounterPayload = {
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExam?: string;
  assessment?: string;
  plan?: string;
};

export const encountersService = {
  getByAppointment(appointmentId: string) {
    return request<Encounter>(`/encounters/${appointmentId}`);
  },

  create(appointmentId: string, payload: CreateEncounterPayload) {
    return request<Encounter>(`/encounters/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(appointmentId: string, payload: Partial<CreateEncounterPayload>) {
    return request<Encounter>(`/encounters/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};