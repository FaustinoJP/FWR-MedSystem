export function isAdmin(role?: string) {
  return role === 'ADMIN';
}

export function canAccessPatients(role?: string) {
  return ['ADMIN', 'RECEPCIONISTA', 'ENFERMEIRO', 'MEDICO'].includes(role || '');
}

export function canCreatePatients(role?: string) {
  return ['ADMIN', 'RECEPCIONISTA'].includes(role || '');
}

export function canAccessAppointments(role?: string) {
  return ['ADMIN', 'RECEPCIONISTA', 'ENFERMEIRO', 'MEDICO', 'FATURACAO'].includes(role || '');
}

export function canCreateAppointments(role?: string) {
  return ['ADMIN', 'RECEPCIONISTA'].includes(role || '');
}

export function canAccessAgenda(role?: string) {
  return ['ADMIN', 'RECEPCIONISTA', 'ENFERMEIRO', 'MEDICO'].includes(role || '');
}

export function canAccessTriage(role?: string) {
  return ['ADMIN', 'ENFERMEIRO', 'MEDICO'].includes(role || '');
}

export function canEditTriage(role?: string) {
  return ['ADMIN', 'ENFERMEIRO', 'MEDICO'].includes(role || '');
}

export function canAccessEncounter(role?: string) {
  return ['ADMIN', 'MEDICO'].includes(role || '');
}

export function canEditEncounter(role?: string) {
  return ['ADMIN', 'MEDICO'].includes(role || '');
}

export function canAccessPrescriptions(role?: string) {
  return ['ADMIN', 'MEDICO'].includes(role || '');
}

export function canEditPrescriptions(role?: string) {
  return ['ADMIN', 'MEDICO'].includes(role || '');
}

export function canAccessLabOrders(role?: string) {
  return ['ADMIN', 'MEDICO'].includes(role || '');
}

export function canEditLabOrders(role?: string) {
  return ['ADMIN', 'MEDICO'].includes(role || '');
}

export function canAccessBilling(role?: string) {
  return ['ADMIN', 'FATURACAO'].includes(role || '');
}

export function canEditBilling(role?: string) {
  return ['ADMIN', 'FATURACAO'].includes(role || '');
}

export function canCompleteAppointment(role?: string) {
  return ['ADMIN', 'MEDICO'].includes(role || '');
}

export function canManageStaff(role?: string) {
  return ['ADMIN'].includes(role || '');
}

export function canManageDepartments(role?: string) {
  return ['ADMIN'].includes(role || '');
}

export function canSeePatientsToday(role?: string) {
  return ['ADMIN', 'RECEPCIONISTA'].includes(role || '');
}

export function canSeeAppointmentsToday(role?: string) {
  return ['ADMIN', 'RECEPCIONISTA', 'ENFERMEIRO', 'MEDICO'].includes(role || '');
}

export function canSeeInConsultationToday(role?: string) {
  return ['ADMIN', 'ENFERMEIRO', 'MEDICO'].includes(role || '');
}

export function canSeeRevenueToday(role?: string) {
  return ['ADMIN', 'FATURACAO'].includes(role || '');
}