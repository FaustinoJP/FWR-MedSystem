'use client';
import { useEffect, useState } from 'react';
import { appointmentsService } from '@/services/appointments.service';
import { Appointment } from '@/types';

export default function AppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  useEffect(() => {
    appointmentsService.list().then(setItems).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Consultas</h1>
      <p><a href="/dashboard">Dashboard</a></p>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((a) => (
          <div key={a.id} style={{ background: 'white', padding: 16, borderRadius: 12 }}>
            <strong>{a.patient.firstName} {a.patient.lastName}</strong>
            <div>{a.department.name} • {a.doctor.name}</div>
            <div>{new Date(a.appointmentDate).toLocaleString('pt-PT')} • {a.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
