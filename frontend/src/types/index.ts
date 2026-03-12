export type LoginResponse = {
  accessToken: string;
  user: { id: string; name: string; email: string; role?: string };
};

export type Patient = {
  id: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bloodGroup?: string;
  gender: string;
  dateOfBirth: string;
};

export type Appointment = {
  id: string;
  appointmentDate: string;
  status: string;
  reason?: string;
  patient: { id: string; firstName: string; lastName: string; patientCode: string };
  doctor: { id: string; name: string };
  department: { id: string; name: string };
};
