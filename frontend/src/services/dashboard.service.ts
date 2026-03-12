import { request } from '@/lib/api';

export const dashboardService = {
  summary() {
    return request<any>('/dashboard/summary');
  },
};
