import { request } from '@/lib/api';

export type LabOrder = {
  id: string;
  appointmentId: string;
  examTypeId: string;
  examType?: {
    id: string;
    name: string;
    code: string;
    department: string;
    category?: string;
  };
  priority: 'LOW' | 'NORMAL' | 'URGENT';
  status: string;
  notes?: string | null;
  requestedAt?: string;
  createdAt: string;
  requestedBy?: string;
};

export type CreateLabOrderPayload = {
  examTypeId: string;
  priority?: 'LOW' | 'NORMAL' | 'URGENT';
  notes?: string;
};

export const labOrdersService = {
  // Lista exames por appointment (nova rota)
  listByAppointment(appointmentId: string) {
    return request<LabOrder[]>(`/lab/exam-requests?appointmentId=${appointmentId}`);
  },

  // Cria novo exame (nova rota)
  create(payload: CreateLabOrderPayload & { appointmentId: string }) {
    return request<LabOrder>('/lab/exam-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};