'use client';

import { useEffect, useState } from 'react';
import { appointmentDetailsService } from '@/services/appointment-details.service';

export function useAppointmentDetails(id: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    appointmentDetailsService
      .getById(id)
      .then(setData)
      .catch((err) => setError(err.message || 'Erro ao carregar consulta'))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error, refetch: () => appointmentDetailsService.getById(id).then(setData) };
}