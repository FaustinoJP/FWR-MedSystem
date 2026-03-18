import { request } from '@/lib/api';
import { Appointment } from '@/types';


export type CreateAppointmentPayload = {
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: string;
  reason?: string;
};

export const appointmentsService = {
  list() {
    return request<Appointment[]>('/appointments');
  },

  create(payload: CreateAppointmentPayload) {
    return request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
