export type Prescription = {
  id: string;
  appointmentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePrescriptionPayload = {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
};
