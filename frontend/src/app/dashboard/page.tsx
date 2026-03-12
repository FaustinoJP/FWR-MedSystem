'use client';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    dashboardService.summary().then(setData).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p><a href="/patients">Pacientes</a> | <a href="/appointments">Consultas</a></p>
      {!data ? <p>A carregar...</p> : (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <Card title="Pacientes hoje" value={data.summary.patientsToday} />
          <Card title="Consultas hoje" value={data.summary.appointmentsToday} />
          <Card title="Em consulta" value={data.summary.inConsultationToday} />
          <Card title="Receita do dia" value={data.summary.revenueToday} />
        </div>
      )}
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return <div style={{ background: 'white', padding: 16, borderRadius: 12 }}><strong>{title}</strong><div style={{ fontSize: 28 }}>{String(value)}</div></div>;
}
