'use client';

import { useEffect, useState } from 'react';
import { paymentMethodsService } from '@/services/payment-methods.service';
import type { PaymentMethod } from '@/types/payment-method';

export function usePaymentMethods() {
  const [data, setData] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const result = await paymentMethodsService.list();
      setData(result);
      setError('');
    } catch (err: any) {
      setData([]);
      setError(err.message || 'Erro ao carregar métodos de pagamento');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: load,
  };
}