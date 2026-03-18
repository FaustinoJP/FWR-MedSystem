'use client';

import { useEffect, useState } from 'react';
import { patientsService, type CreatePatientPayload, type Patient } from '@/services/patients.service';

export function usePatients(search?: string) {
  const [data, setData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const result = await patientsService.list(search);
      setData(result);
      setError('');
    } catch (err: any) {
      setData([]);
      setError(err.message || 'Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search]);

  async function create(payload: CreatePatientPayload) {
    const result = await patientsService.create(payload);
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