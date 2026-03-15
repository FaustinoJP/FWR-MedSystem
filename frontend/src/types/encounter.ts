export type Encounter = {
  id: string;
  appointmentId: string;
  status: string;
  chiefComplaint?: string | null;
  historyOfPresentIllness?: string | null;
  physicalExam?: string | null;
  assessment?: string | null;
  plan?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateEncounterPayload = {
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExam?: string;
  assessment?: string;
  plan?: string;
};
