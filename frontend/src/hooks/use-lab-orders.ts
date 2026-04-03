'use client';

import { labOrdersService } from '@/services/lab-orders.service';
import { useEffect, useState } from 'react';

export type LabOrder = {
  id: string;
  examTypeId: string;
  examType?: {
    id: string;
    name: string;
    code: string;
    department: string;
  };
  priority: 'LOW' | 'NORMAL' | 'URGENT';
  status: string;
  notes?: string;
  requestedAt?: string;
  createdAt: string;
  requestedBy?: string;
};

export type CreateLabOrderPayload = {
  examTypeId: string;
  priority?: 'LOW' | 'NORMAL' | 'URGENT';
  notes?: string;
};

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
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${baseUrl}/lab/exam-requests?appointmentId=${appointmentId}`);

      if (!res.ok) {
        throw new Error('Erro ao carregar exames');
      }

      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error(err);
      setData([]);
      setError(err.message || 'Erro ao carregar exames');
    } finally {
      setLoading(false);
    }
  }

  // Carregar ao mudar o appointmentId
  useEffect(() => {
    load();
  }, [appointmentId]);

  // Função create (usada no formulário)
    async function create(payload: CreateLabOrderPayload) {
    try {
      const result = await labOrdersService.create({
        ...payload,
        appointmentId,
      });

      // Atualiza lista localmente
      setData((prev) => [result, ...prev]);
      return result;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

  return {
    data,
    loading,
    error,
    create,
    refetch: load,
  };
}