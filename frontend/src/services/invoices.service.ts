import { request } from '@/lib/api';
import type { CreateInvoicePayload, Invoice } from '@/types/invoice';

export const invoicesService = {
  getByAppointment(appointmentId: string) {
    return request<Invoice & { payments?: any[] }>(
      `/appointments/${appointmentId}/invoice`,
    );
  },

  create(appointmentId: string, payload: CreateInvoicePayload) {
    return request<Invoice>(`/appointments/${appointmentId}/invoice`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(id: string, status: string) {
    return request<Invoice>(`/invoices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};