'use client';

import { useState } from 'react';
import { appointmentsCompleteService } from '@/services/appointments-complete.service';

export function useCompleteAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function complete(id: string) {
    setLoading(true);
    setError('');

    try {
      return await appointmentsCompleteService.complete(id);
    } catch (err: any) {
      setError(err.message || 'Erro ao encerrar consulta');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    complete,
    loading,
    error,
  };
}