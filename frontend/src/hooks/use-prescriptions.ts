'use client';

import { useEffect, useState } from 'react';
import {
  prescriptionsService,
  type CreatePrescriptionPayload,
  type Prescription,
} from '@/services/prescriptions.service';

export function usePrescriptions(appointmentId: string) {
  const [data, setData] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    if (!appointmentId) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const result = await prescriptionsService.listByAppointment(appointmentId);
      setData(Array.isArray(result) ? result : []);
      setError('');
    } catch (err: any) {
      setData([]);
      setError(err.message || 'Erro ao carregar prescrições');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [appointmentId]);

  async function create(payload: CreatePrescriptionPayload) {
    const result = await prescriptionsService.create(appointmentId, payload);
    setData((prev) => [result, ...prev]);
    return result;
  }

  return {
    data,
    loading,
    error,
    create,
    refetch: load,
  };
}