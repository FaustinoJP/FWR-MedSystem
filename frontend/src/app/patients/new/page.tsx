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
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dateOfBirth: '',
    phone: '',
    bloodGroup: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const result = await patientsService.create({
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone || undefined,
        bloodGroup: form.bloodGroup || undefined,
      });

      setMessage('Paciente criado com sucesso.');
      router.push(`/patients/${result.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Erro ao criar paciente');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20, maxWidth: 900 }}>
      <div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={topNavLinkStyle}>
              ← Dashboard
            </Link>
            <Link href="/patients" style={topNavLinkStyle}>
              ← Pacientes
            </Link>
          </div>
        <h1 style={{ margin: '12px 0 4px' }}>Novo paciente</h1>
        <p style={{ margin: 0, color: '#64748b' }}>
          Registo de paciente no sistema hospitalar.
        </p>
      </div>

      <section style={cardStyle}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={grid2}>
            <Field label="Primeiro nome">
              <input
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                style={inputStyle}
                required
              />
            </Field>

            <Field label="Último nome">
              <input
                value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                style={inputStyle}
                required
              />
            </Field>

            <Field label="Sexo">
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER',
                  }))
                }
                style={inputStyle}
              >
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
              />
            </Field>

            <Field label="Grupo sanguíneo">
              <input
                value={form.bloodGroup}
                onChange={(e) => setForm((p) => ({ ...p, bloodGroup: e.target.value }))}
                placeholder="Ex.: O+"
                style={inputStyle}
              />
            </Field>
          </div>

          {message ? (
            <p style={{ color: message.includes('sucesso') ? 'green' : 'crimson', margin: 0 }}>
              {message}
            </p>
          ) : null}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" style={buttonStyle} disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar paciente'}
            </button>

            <Link href="/patients" style={secondaryLinkStyle}>
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 12,
  padding: 20,
};

const grid2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  border: 0,
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
};

const secondaryLinkStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: 'white',
  color: '#0f172a',
  textDecoration: 'none',
};

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};