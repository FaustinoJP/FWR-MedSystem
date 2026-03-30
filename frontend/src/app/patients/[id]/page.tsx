'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patientsService, type Patient } from '@/services/patients.service';

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-PT');
}

export default function PatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const result = await patientsService.getById(id);
      setPatient(result);
      setError('');
    } catch (err: any) {
      setPatient(null);
      setError(err.message || 'Erro ao carregar paciente');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>A carregar paciente...</div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{ ...cardStyle, color: 'crimson' }}>
            {error || 'Paciente não encontrado'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              <Link href="/dashboard" style={topNavLinkStyle}>
                ← Dashboard
              </Link>
              <Link href="/patients" style={topNavLinkStyle}>
                ← Pacientes
              </Link>
            </div>

            <h1 style={{ margin: 0 }}>
              {patient.firstName} {patient.lastName}
            </h1>
            <p style={subtitleStyle}>
              Código do paciente: {patient.patientCode}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href={`/appointments/new?patientId=${patient.id}`}
              style={primaryButtonStyle}
            >
              Agendar consulta
            </Link>
          </div>
        </div>

        <section style={cardStyle}>
          <div style={badgesRowStyle}>
            <Badge label={`Sexo: ${patient.gender}`} />
            <Badge label={`Grupo sanguíneo: ${patient.bloodGroup || '-'}`} />
            <Badge label={`Nascimento: ${formatDate(patient.dateOfBirth)}`} />
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Dados do paciente</h2>

          <div style={infoGridStyle}>
            <Info label="Primeiro nome" value={patient.firstName} />
            <Info label="Último nome" value={patient.lastName} />
            <Info label="Sexo" value={patient.gender} />
            <Info label="Nascimento" value={formatDate(patient.dateOfBirth)} />
            <Info label="Telefone" value={patient.phone || '-'} />
            <Info label="Grupo sanguíneo" value={patient.bloodGroup || '-'} />
            <Info label="Código" value={patient.patientCode} />
            <Info label="Registado em" value={formatDate(patient.createdAt)} />
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Ações rápidas</h2>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href={`/appointments/new?patientId=${patient.id}`}
              style={primaryButtonStyle}
            >
              Agendar consulta
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoCardStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        background: '#e2e8f0',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

const pageStyle: React.CSSProperties = {
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: '0 auto',
  display: 'grid',
  gap: 20,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const subtitleStyle: React.CSSProperties = {
  margin: '6px 0 0',
  color: '#64748b',
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 20,
  display: 'grid',
  gap: 16,
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
};

const badgesRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
};

const infoGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
};

const infoCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 14,
  background: '#f8fafc',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#64748b',
  marginBottom: 6,
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  background: '#0f172a',
  color: 'white',
  textDecoration: 'none',
  fontWeight: 600,
};

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};