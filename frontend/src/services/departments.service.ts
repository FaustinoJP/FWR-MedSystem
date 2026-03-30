import { request } from '@/lib/api';

export type DepartmentItem = {
  id: string;
  name: string;
};

export type CreateDepartmentPayload = {
  name: string;
};

export type UpdateDepartmentPayload = {
  name?: string;
};

export const departmentsService = {
  list() {
    return request<DepartmentItem[]>('/departments');
  },

  getById(id: string) {
    return request<DepartmentItem>(`/departments/${id}`);
  },

  create(payload: CreateDepartmentPayload) {
    return request<DepartmentItem>('/departments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: UpdateDepartmentPayload) {
    return request<DepartmentItem>(`/departments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string) {
    return request<void>(`/departments/${id}`, {
      method: 'DELETE',
    });
  },
};