'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { patientsService } from '@/services/patients.service';

export default function NewPatientPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '' as '' | 'MALE' | 'FEMALE' | 'OTHER',
    dateOfBirth: '',
    phone: '',
    bloodGroup: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (!form.gender) {
        setMessage('Por favor, selecione um sexo');
        setSaving(false);
        return;
      }

      const created = await patientsService.create({
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender as 'MALE' | 'FEMALE' | 'OTHER',
        dateOfBirth: form.dateOfBirth,
        phone: form.phone || undefined,
        bloodGroup: form.bloodGroup || undefined,
      });

      router.push(`/patients/${created.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Erro ao criar paciente');
    } finally {
      setSaving(false);
    }
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

            <h1 style={{ margin: 0 }}>Novo paciente</h1>
            <p style={subtitleStyle}>
              Registar novo paciente no sistema hospitalar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={cardStyle}>
          <div style={grid2}>
            <Field label="Primeiro nome">
              <input
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                style={inputStyle}
                placeholder="Ex.: Maria"
                required
              />
            </Field>

            <Field label="Último nome">
              <input
                value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                style={inputStyle}
                placeholder="Ex.: Fernandes"
                required
              />
            </Field>

            <Field label="Sexo">
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    gender: e.target.value as '' | 'MALE' | 'FEMALE' | 'OTHER',
                  }))
                }
                style={inputStyle}
                required
              >
                <option value="">Selecione</option>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
                <option value="OTHER">Outro</option>
              </select>
            </Field>

            <Field label="Data de nascimento">
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                style={inputStyle}
                required
              />
            </Field>

            <Field label="Telefone">
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                style={inputStyle}
                placeholder="Ex.: +244923000111"
              />
            </Field>

            <Field label="Grupo sanguíneo">
              <select
                value={form.bloodGroup}
                onChange={(e) => setForm((p) => ({ ...p, bloodGroup: e.target.value }))}
                style={inputStyle}
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </Field>
          </div>

          {message ? (
            <p style={{ color: 'crimson', margin: 0 }}>{message}</p>
          ) : null}

          <div style={actionsStyle}>
            <Link href="/patients" style={secondaryLinkStyle}>
              Cancelar
            </Link>

            <button type="submit" style={buttonStyle} disabled={saving}>
              {saving ? 'A guardar...' : 'Criar paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

const pageStyle: React.CSSProperties = {
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
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

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e2e8f0',
  padding: 24,
  borderRadius: 16,
  display: 'grid',
  gap: 20,
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
};

const grid2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 16,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: '#fff',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 4,
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 18px',
  borderRadius: 10,
  border: 0,
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 600,
};

const secondaryLinkStyle: React.CSSProperties = {
  padding: '12px 18px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: 'white',
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};