'use client';

import { useEffect, useState } from 'react';
import { paymentsService } from '@/services/payments.service';
import type { CreatePaymentPayload, Payment } from '@/types/payment';

export function usePayments(invoiceId?: string) {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    if (!invoiceId) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const result = await paymentsService.listByInvoice(invoiceId);
      setData(result);
      setError('');
    } catch (err: any) {
      setData([]);
      setError(err.message || 'Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [invoiceId]);

  async function create(payload: CreatePaymentPayload) {
    if (!invoiceId) throw new Error('Fatura não encontrada');
    const result = await paymentsService.create(invoiceId, payload);
    await load();
    return result;
  }

  async function updateStatus(paymentId: string, status: string) {
    const result = await paymentsService.updateStatus(paymentId, status);
    await load();
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