import { request } from '@/lib/api';

export type DepartmentItem = {
  id: string;
  name: string;
};

export const departmentsService = {
  list() {
    return request<DepartmentItem[]>('/departments');
  },

  getById(id: string) {
    return request<DepartmentItem>(`/departments/${id}`);
  },
};