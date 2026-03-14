export type LabOrder = {
  id: string;
  appointmentId: string;
  testName: string;
  category?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLabOrderPayload = {
  testName: string;
  category?: string;
  notes?: string;
};