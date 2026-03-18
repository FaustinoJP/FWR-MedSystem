import { request } from '@/lib/api';
import type { CreatePaymentPayload, Payment } from '@/types/payment';

export const paymentsService = {
  listByInvoice(invoiceId: string) {
    return request<Payment[]>(`/invoices/${invoiceId}/payments`);
  },

  create(invoiceId: string, payload: CreatePaymentPayload) {
    return request<Payment>(`/invoices/${invoiceId}/payments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(id: string, status: string) {
    return request<Payment>(`/payments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};