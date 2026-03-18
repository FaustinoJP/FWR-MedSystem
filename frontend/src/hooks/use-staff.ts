'use client';

import { useEffect, useState } from 'react';
import { staffService, type CreateStaffPayload, type StaffUser } from '@/services/staff.service';

export function useStaff(search?: string) {
  const [data, setData] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const result = await staffService.list(search);
      setData(result);
      setError('');
    } catch (err: any) {
      setData([]);
      setError(err.message || 'Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search]);

  async function create(payload: CreateStaffPayload) {
    const result = await staffService.create(payload);
    await load();
    return result;
  }

  return {
    data,
    loading,
    error,
    refetch: load,
    create,
  };
}