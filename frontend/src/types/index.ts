export type LoginResponse = {
  accessToken: string;
  user: { id: string; name: string; email: string; role?: string };
};

export type Role = {
  id: string;
  name: string;
  description?: string | null;
};

export type Department = {
  id: string;
  name: string;
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  roleId?: string;
  departmentId?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  role?: Role;
  department?: Department | null;
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

export type Prescription = {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
};

export type Appointment = {
  id: string;
  appointmentDate: string;
  status: string;
  reason?: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    patientCode: string;
  };
  doctor: {
    id: string;
    name: string;
  };
  department: {
    id: string;
    name: string;
  };
  prescriptions?: Prescription[];
};