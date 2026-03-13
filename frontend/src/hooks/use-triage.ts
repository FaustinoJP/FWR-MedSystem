'use client';

import { useEffect, useState } from 'react';
import { triageService } from '@/services/triage.service';
import type { CreateTriagePayload } from '@/types/triage';

export function useTriage(appointmentId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const result = await triageService.getByAppointment(appointmentId);
      setData(result);
      setError('');
    } catch (err: any) {
      setData(null);
      setError(err.message || 'Erro ao carregar triagem');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [appointmentId]);

  async function create(payload: CreateTriagePayload) {
    const result = await triageService.create(appointmentId, payload);
    setData(result);
    return result;
  }

  async function update(payload: CreateTriagePayload) {
    const result = await triageService.update(appointmentId, payload);
    setData(result);
    return result;
  }

  return { data, loading, error, create, update, refetch: load };
}
