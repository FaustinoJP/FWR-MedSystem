import { request } from '@/lib/api';
import type { CreateLabOrderPayload, LabOrder } from '@/types/lab-order';

export const labOrdersService = {
  listByAppointment(appointmentId: string) {
    return request<LabOrder[]>(`/appointments/${appointmentId}/lab-orders`);
  },

  create(appointmentId: string, payload: CreateLabOrderPayload) {
    return request<LabOrder>(`/appointments/${appointmentId}/lab-orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getById(id: string) {
    return request<LabOrder>(`/lab-orders/${id}`);
  },

  update(id: string, payload: Partial<CreateLabOrderPayload>) {
    return request<LabOrder>(`/lab-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};