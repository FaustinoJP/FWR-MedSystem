'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { staffService, StaffUser } from '@/services/staff.service';

function statusLabel(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'Ativo';
    case 'INACTIVE':
      return 'Inativo';
    case 'SUSPENDED':
      return 'Suspenso';
    default:
      return status;
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return '#16a34a';
    case 'INACTIVE':
      return '#6b7280';
    case 'SUSPENDED':
      return '#dc2626';
    default:
      return '#0f172a';
  }
}

export default function StaffPage() {
  const [items, setItems] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      setLoading(true);
      const data = await staffService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();

    return items.filter((item) => {
      if (!q) return true;

      const text = [
        item.name,
        item.email,
        item.role?.name || '',
        item.department?.name || '',
        item.status,
      ]
        .join(' ')
        .toLowerCase();

      return text.includes(q);
    });
  }, [items, search]);

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Profissionais</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>
            Gestão de médicos, enfermeiros, rececionistas e faturação.
          </p>
          <p style={{ margin: '8px 0 0' }}>
            <Link href="/dashboard">← Voltar ao dashboard</Link>
          </p>
        </div>

        <Link
          href="/staff/new"
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            background: '#0f172a',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          + Novo profissional
        </Link>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <label style={{ display: 'grid', gap: 6, maxWidth: 360 }}>
          <strong>Pesquisar</strong>
          <input
            type="text"
            placeholder="Nome, email, perfil ou departamento"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
        </label>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          overflowX: 'auto',
        }}
      >
        {loading ? (
          <div style={{ padding: 20 }}>A carregar profissionais...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 20 }}>Nenhum profissional encontrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Perfil</th>
                <th style={thStyle}>Departamento</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>
                    <strong>{item.name}</strong>
                  </td>
                  <td style={tdStyle}>{item.email}</td>
                  <td style={tdStyle}>{item.role?.name || '-'}</td>
                  <td style={tdStyle}>{item.department?.name || '-'}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        color: statusColor(item.status),
                        fontWeight: 700,
                      }}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <Link href={`/staff/${item.id}`}>Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: 12,
  borderBottom: '1px solid #e2e8f0',
  fontSize: 14,
  background: '#f8fafc',
};

const tdStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: '1px solid #f1f5f9',
  fontSize: 14,
  verticalAlign: 'top',
};