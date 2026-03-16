import { request } from '@/lib/api';

export const appointmentsCompleteService = {
  complete(id: string) {
    return request(`/appointments/${id}/complete`, {
      method: 'PATCH',
    });
  },
};