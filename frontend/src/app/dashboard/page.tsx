'use client';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentUser, type AuthUser } from '@/lib/auth';
import {
  canAccessPatients,
  canAccessAppointments,
  canAccessAgenda,
  canManageStaff,
  canManageDepartments,
  canSeePatientsToday,
  canSeeAppointmentsToday,
  canSeeInConsultationToday,
  canSeeRevenueToday,
} from '@/lib/permissions';
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    dashboardService.summary().then(setData).catch(console.error);
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setReady(true);
  }, []);

  const role = user?.role;

  return (
    <div style={{ padding: 24, display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <p style={{ margin: '8px 0 0', color: '#64748b' }}>
          Visão geral do Faustware MedSystem.
        </p>
      </div>

      {ready && (
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          {canAccessPatients(role) && (
            <QuickLinkCard
              title="Pacientes"
              description="Cadastrar, consultar e gerir pacientes"
              href="/patients"
            />
          )}
           
          {canAccessAppointments(role) && (
            <QuickLinkCard
              title="Consultas"
              description="Listar e acompanhar consultas"
              href="/appointments"
            />
          )}

          {canAccessAgenda(role) && (
            <QuickLinkCard
              title="Agenda médica"
              description="Ver consultas agrupadas por médico"
              href="/appointments/agenda"
            />
          )}

          {canManageStaff(role) && (
            <QuickLinkCard
              title="Profissionais"
              description="Gerir médicos, enfermeiros e receção"
              href="/staff"
            />
          )}

          {canManageDepartments(role) && (
            <QuickLinkCard
              title="Departamentos"
              description="Gerir especialidades e áreas clínicas"
              href="/departments"
            />
          )}
        </div>
      )}

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
          {canSeePatientsToday(role) && <Card title="Pacientes hoje" value={data.summary.patientsToday} />}
          {canSeeAppointmentsToday(role) && <Card title="Consultas hoje" value={data.summary.appointmentsToday} />}
          {canSeeInConsultationToday(role) && <Card title="Em consulta" value={data.summary.inConsultationToday} />}
          {canSeeRevenueToday(role) && <Card title="Receita do dia" value={data.summary.revenueToday} />}
        </div>
      )}

      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: 16,
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontWeight: 700 }}>Sessão</div>
          <div style={{ color: '#64748b', fontSize: 14 }}>
            {ready ? `${user?.name || 'Utilizador'}${user?.role ? ` • ${user.role}` : ''}` : '...'}
          </div>
        </div>

        <button type="button" onClick={logout} style={logoutButtonStyle}>
          Terminar sessão
        </button>
      </div>
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

const logoutButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 600,
};