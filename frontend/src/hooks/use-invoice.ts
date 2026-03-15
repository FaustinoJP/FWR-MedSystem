'use client';

import { useEffect, useState } from 'react';
import { invoicesService } from '@/services/invoices.service';
import type { CreateInvoicePayload } from '@/types/invoice';

export function useInvoice(appointmentId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const result = await invoicesService.getByAppointment(appointmentId);
      setData(result);
      setError('');
    } catch (err: any) {
      setData(null);
      setError(err.message || 'Erro ao carregar fatura');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [appointmentId]);

  async function create(payload: CreateInvoicePayload) {
    const result = await invoicesService.create(appointmentId, payload);
    setData(result);
    return result;
  }

  async function updateStatus(status: string) {
    if (!data?.id) throw new Error('Fatura não encontrada');
    const result = await invoicesService.updateStatus(data.id, status);
    setData(result);
    return result;
  }

  return {
    data,
    loading,
    error,
    create,
    updateStatus,
    refetch: load,
  };
}