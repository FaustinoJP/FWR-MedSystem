import { request } from '@/lib/api';

export type LabOrder = {
  id: string;
  appointmentId: string;
  testName: string;
  category?: string | null;
  notes?: string | null;
  status: string;
  createdAt?: string;
};

export type CreateLabOrderPayload = {
  testName: string;
  category?: string;
  notes?: string;
};

export const labOrdersService = {
  listByAppointment(appointmentId: string) {
    return request<LabOrder[]>(`/lab-orders/${appointmentId}`);
  },

  create(appointmentId: string, payload: CreateLabOrderPayload) {
    return request<LabOrder>(`/lab-orders/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};