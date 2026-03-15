export type Invoice = {
  id: string;
  patientId: string;
  appointmentId?: string | null;
  invoiceNumber: string;
  description?: string | null;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvoicePayload = {
  description?: string;
  totalAmount: number;
  discountAmount?: number;
};