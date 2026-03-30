import { request } from '@/lib/api';
import type { CreateInvoicePayload, Invoice } from '@/types/invoice';

export const invoicesService = {
  getByAppointment(appointmentId: string) {
    return request<Invoice>(`/billing/invoice/${appointmentId}`);
  },

  create(appointmentId: string, payload: CreateInvoicePayload) {
    return request<Invoice>(`/billing/invoice/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(invoiceId: string, status: string) {
    return request<Invoice>(`/billing/invoice/${invoiceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};