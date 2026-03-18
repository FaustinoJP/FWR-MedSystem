'use client';

import { useEffect, useState } from 'react';
import { labOrdersService } from '@/services/lab-orders.service';
import type { CreateLabOrderPayload, LabOrder } from '@/types/lab-order';

export function useLabOrders(appointmentId: string) {
  const [data, setData] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const result = await labOrdersService.listByAppointment(appointmentId);
      setData(result);
      setError('');
    } catch (err: any) {
      setData([]);
      setError(err.message || 'Erro ao carregar exames');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [appointmentId]);

  async function create(payload: CreateLabOrderPayload) {
    const result = await labOrdersService.create(appointmentId, payload);
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