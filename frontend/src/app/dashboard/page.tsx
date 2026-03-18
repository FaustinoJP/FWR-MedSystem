'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    dashboardService.summary().then(setData).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 24, display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <p style={{ margin: '8px 0 0', color: '#64748b' }}>
          Visão geral do Faustware MedSystem.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <QuickLinkCard
          title="Pacientes"
          description="Cadastrar, consultar e gerir pacientes"
          href="/patients"
        />
        <QuickLinkCard
          title="Consultas"
          description="Listar e acompanhar consultas"
          href="/appointments"
        />
        <QuickLinkCard
          title="Agenda médica"
          description="Ver consultas agrupadas por médico"
          href="/appointments/agenda"
        />
        <QuickLinkCard
          title="Profissionais"
          description="Gerir médicos, enfermeiros e receção"
          href="/staff"
        />
      </div>

      {!data ? (
        <p>A carregar...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
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
  return (
    <div
      style={{
        background: 'white',
        padding: 18,
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 10 }}>{title}</strong>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{String(value)}</div>
    </div>
  );
}

function QuickLinkCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        background: 'white',
        padding: 18,
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        textDecoration: 'none',
        color: '#0f172a',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        display: 'grid',
        gap: 8,
      }}
    >
      <strong style={{ fontSize: 18 }}>{title}</strong>
      <span style={{ color: '#64748b', fontSize: 14 }}>{description}</span>
    </a>
  );
}