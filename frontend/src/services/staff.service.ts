import { request } from '@/lib/api';

export type StaffRole = {
  id: string;
  name: string;
  description?: string | null;
};

export type StaffDepartment = {
  id: string;
  name: string;
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  departmentId?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  role?: {
    id: string;
    name: string;
    description?: string | null;
  };
  department?: {
    id: string;
    name: string;
  } | null;
};

export type CreateStaffPayload = {
  name: string;
  email: string;
  password: string;
  roleId: string;
  departmentId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
};

export type UpdateStaffPayload = {
  name?: string;
  email?: string;
  roleId?: string;
  departmentId?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
};

export const staffService = {
  list(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<StaffUser[]>(`/users${query}`);
  },

  listDoctors() {
    return request<StaffUser[]>('/users/doctors');
  },

  getById(id: string) {
    return request<StaffUser>(`/users/${id}`);
  },

  create(payload: CreateStaffPayload) {
    return request<StaffUser>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

    update(id: string, payload: UpdateStaffPayload) {
    return request<StaffUser>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};