import { request } from '@/lib/api';
import { LoginResponse } from '@/types';

export const authService = {
  login(email: string, password: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  me() {
    return request<any>('/auth/me');
  },
};
