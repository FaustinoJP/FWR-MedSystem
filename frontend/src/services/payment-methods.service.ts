import { request } from '@/lib/api';
import type { PaymentMethod } from '@/types/payment-method';

export const paymentMethodsService = {
  list() {
    return request<PaymentMethod[]>('/payment-methods');
  },
};