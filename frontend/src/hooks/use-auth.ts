'use client';
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { clearToken, setToken } from '@/lib/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setToken(data.accessToken);
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    window.location.href = '/login';
  }

  return { login, logout, loading };
}
