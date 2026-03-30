'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { departmentsService } from '@/services/departments.service';

export default function NewDepartmentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const created = await departmentsService.create({ name });
      router.push(`/departments/${created.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Erro ao criar departamento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Novo departamento</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>
            Criar nova especialidade ou área clínica.
          </p>
          <p style={{ margin: '8px 0 0' }}>
            <Link href="/departments">← Voltar aos departamentos</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={cardStyle}>
          <label style={{ display: 'grid', gap: 6 }}>
            <strong>Nome</strong>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              placeholder="Ex.: Pediatria"
              required
            />
          </label>

          {message ? <p style={{ color: 'red', margin: 0 }}>{message}</p> : null}

          <button type="submit" style={buttonStyle} disabled={saving}>
            {saving ? 'A guardar...' : 'Criar departamento'}
          </button>
        </form>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1000,
  margin: '0 auto',
  display: 'grid',
  gap: 20,
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 20,
  display: 'grid',
  gap: 16,
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
};

const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
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