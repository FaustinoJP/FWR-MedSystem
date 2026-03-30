import { request } from '@/lib/api';
import type { CreatePaymentPayload, Payment } from '@/types/payment';

export const paymentsService = {
  listByInvoice(invoiceId: string) {
    return request<Payment[]>(`/billing/payments/${invoiceId}`);
  },

  create(invoiceId: string, payload: CreatePaymentPayload) {
    return request<Payment>(`/billing/payments/${invoiceId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(paymentId: string, status: string) {
    return request<Payment>(`/billing/payments/${paymentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};