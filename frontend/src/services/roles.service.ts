import { request } from '@/lib/api';

export type RoleItem = {
  id: string;
  name: string;
  description?: string | null;
};

export const rolesService = {
  list() {
    return request<RoleItem[]>('/roles');
  },
};