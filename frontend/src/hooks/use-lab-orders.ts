'use client';

import { useEffect, useState } from 'react';
import {
  labOrdersService,
  type CreateLabOrderPayload,
  type LabOrder,
} from '@/services/lab-orders.service';

export function useLabOrders(appointmentId: string) {
  const [data, setData] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    if (!appointmentId) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const result = await labOrdersService.listByAppointment(appointmentId);
      setData(Array.isArray(result) ? result : []);
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