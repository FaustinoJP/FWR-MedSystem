'use client';

import { useEffect, useState } from 'react';
import { encountersService } from '@/services/encounters.service';
import type { CreateEncounterPayload } from '@/types/encounter';

export function useEncounter(appointmentId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const result = await encountersService.getByAppointment(appointmentId);
      setData(result);
      setError('');
    } catch (err: any) {
      setData(null);
      setError(err.message || 'Erro ao carregar atendimento');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [appointmentId]);

  async function create(payload: CreateEncounterPayload) {
    const result = await encountersService.create(appointmentId, payload);
    setData(result);
    return result;
  }

  async function update(payload: CreateEncounterPayload) {
    const result = await encountersService.update(appointmentId, payload);
    setData(result);
    return result;
  }

  return { data, loading, error, create, update, refetch: load };
}