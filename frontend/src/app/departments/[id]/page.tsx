'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { departmentsService, DepartmentItem } from '@/services/departments.service';

export default function DepartmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id);

  const [item, setItem] = useState<DepartmentItem | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      setLoading(true);
      const data = await departmentsService.getById(id);
      setItem(data);
      setName(data.name || '');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setItem(null);
      setMessage(err.message || 'Erro ao carregar departamento');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updated = await departmentsService.update(id, { name });
      setItem(updated);
      setMessage('Departamento atualizado com sucesso.');
    } catch (err: any) {
      setMessage(err.message || 'Erro ao atualizar departamento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Detalhe do departamento</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>
            Ver e editar a especialidade ou área clínica.
          </p>
          <p style={{ margin: '8px 0 0' }}>
            <Link href="/departments">← Voltar aos departamentos</Link>
          </p>
        </div>

        {loading ? (
          <div style={cardStyle}>A carregar...</div>
        ) : !item ? (
          <div style={{ ...cardStyle, color: 'crimson' }}>Departamento não encontrado.</div>
        ) : (
          <form onSubmit={handleSubmit} style={cardStyle}>
            <label style={{ display: 'grid', gap: 6 }}>
              <strong>Nome</strong>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
              />
            </label>

            {message ? (
              <p
                style={{
                  color: message.includes('sucesso') ? 'green' : 'red',
                  margin: 0,
                }}
              >
                {message}
              </p>
            ) : null}

            <button type="submit" style={buttonStyle} disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar alterações'}
            </button>
          </form>
        )}
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