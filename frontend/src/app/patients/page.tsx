'use client';
import { useEffect, useState } from 'react';
import { patientsService } from '@/services/patients.service';
import { Patient } from '@/types';

export default function PatientsPage() {
  const [items, setItems] = useState<Patient[]>([]);
  useEffect(() => {
    patientsService.list().then(setItems).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Pacientes</h1>
      <p><a href="/dashboard">Dashboard</a></p>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((p) => (
          <div key={p.id} style={{ background: 'white', padding: 16, borderRadius: 12 }}>
            <strong>{p.firstName} {p.lastName}</strong>
            <div>{p.patientCode}</div>
            <div>{p.phone || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
