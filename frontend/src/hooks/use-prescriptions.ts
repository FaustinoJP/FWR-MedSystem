'use client';

import { useEffect, useState } from 'react';
import { prescriptionsService } from '@/services/prescriptions.service';
import type { CreatePrescriptionPayload, Prescription } from '@/types/prescription';

export function usePrescriptions(appointmentId: string) {
  const [data, setData] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const result = await prescriptionsService.listByAppointment(appointmentId);
      setData(result);
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
    await load();
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
