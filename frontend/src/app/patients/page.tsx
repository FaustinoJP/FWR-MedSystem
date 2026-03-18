'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePatients } from '@/hooks/use-patients';

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-PT');
}

export default function PatientsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const patientsQuery = usePatients(search);
  const patients = patientsQuery.data;

  const total = useMemo(() => patients.length, [patients]);

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            <Link href="/dashboard" style={topNavLinkStyle}>
              ← Dashboard
            </Link>
          </div>

          <h1 style={{ margin: 0 }}>Pacientes</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>
            Gestão de cadastro de pacientes.
          </p>
        </div>

        <Link href="/patients/new" style={buttonLinkStyle}>
          Novo paciente
        </Link>
      </div>

      <section style={cardStyle}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Pesquisar por nome"
            style={{ ...inputStyle, maxWidth: 320 }}
          />
          <button type="button" style={buttonStyle} onClick={() => setSearch(searchInput)}>
            Pesquisar
          </button>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => {
              setSearchInput('');
              setSearch('');
            }}
          >
            Limpar
          </button>
        </div>

        <div style={{ color: '#64748b', fontSize: 14 }}>
          Total de pacientes: <strong>{total}</strong>
        </div>
      </section>

      <section style={cardStyle}>
        {patientsQuery.loading ? (
          <p style={{ margin: 0 }}>A carregar pacientes...</p>
        ) : patientsQuery.error ? (
          <p style={{ margin: 0, color: 'crimson' }}>{patientsQuery.error}</p>
        ) : patients.length === 0 ? (
          <div style={emptyStateStyle}>Nenhum paciente encontrado.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={rowCardStyle}>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 14 }}>
                      Código: {patient.patientCode}
                    </div>
                  </div>

                  <div>
                    <div style={labelStyle}>Sexo</div>
                    <div>{patient.gender}</div>
                  </div>

                  <div>
                    <div style={labelStyle}>Nascimento</div>
                    <div>{formatDate(patient.dateOfBirth)}</div>
                  </div>

                  <div>
                    <div style={labelStyle}>Telefone</div>
                    <div>{patient.phone || '-'}</div>
                  </div>

                  <div>
                    <div style={labelStyle}>Grupo sanguíneo</div>
                    <div>{patient.bloodGroup || '-'}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 12,
  padding: 16,
  display: 'grid',
  gap: 16,
};

const rowCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 16,
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
  gap: 12,
  alignItems: 'center',
  background: '#f8fafc',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#64748b',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  border: 0,
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: 'white',
  color: '#0f172a',
  cursor: 'pointer',
};

const buttonLinkStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  background: '#0f172a',
  color: 'white',
  textDecoration: 'none',
};

const emptyStateStyle: React.CSSProperties = {
  border: '1px dashed #cbd5e1',
  borderRadius: 10,
  padding: 16,
  color: '#64748b',
  background: '#f8fafc',
};