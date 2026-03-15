export type Payment = {
  id: string;
  invoiceId: string;
  paymentMethodId: string;
  amount: number;
  status: string;
  reference?: string | null;
  transactionReference?: string | null;
  externalTransactionId?: string | null;
  paidAt?: string | null;
  expiresAt?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
  };
};

export type CreatePaymentPayload = {
  paymentMethodId: string;
  amount: number;
  reference?: string;
  transactionReference?: string;
  externalTransactionId?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
};