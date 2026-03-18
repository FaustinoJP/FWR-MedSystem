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
    return <div style={{ padding: 24 }}>A carregar paciente...</div>;
  }

  if (error || !patient) {
    return (
      <div style={{ padding: 24, color: 'crimson' }}>
        {error || 'Paciente não encontrado'}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={topNavLinkStyle}>
            ← Dashboard
          </Link>
          <Link href="/patients" style={topNavLinkStyle}>
            ← Pacientes
          </Link>
        </div>

        <div>
          <h1 style={{ margin: '12px 0 4px' }}>
            {patient.firstName} {patient.lastName}
          </h1>
          <p style={{ margin: 0, color: '#64748b' }}>
            Código do paciente: {patient.patientCode}
          </p>
        </div>
      </div>


      <section style={cardStyle}>
        <div style={grid3}>
          <Info label="Primeiro nome" value={patient.firstName} />
          <Info label="Último nome" value={patient.lastName} />
          <Info label="Sexo" value={patient.gender} />
          <Info label="Nascimento" value={formatDate(patient.dateOfBirth)} />
          <Info label="Telefone" value={patient.phone || '-'} />
          <Info label="Grupo sanguíneo" value={patient.bloodGroup || '-'} />
          <Info label="Registado em" value={formatDate(patient.createdAt)} />
        </div>
      </section>

      <div style={{ display: 'flex', gap: 12 }}>
        <Link href={`/appointments/new?patientId=${patient.id}`} style={buttonLinkStyle}>
          Agendar consulta
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 12,
  padding: 20,
};

const grid3: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 16,
};

const buttonLinkStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  background: '#0f172a',
  color: 'white',
  textDecoration: 'none',
};

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};