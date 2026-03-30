'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { departmentsService, DepartmentItem } from '@/services/departments.service';

export default function DepartmentsPage() {
  const [items, setItems] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      setLoading(true);
      const data = await departmentsService.list();
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
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>Departamentos / Especialidades</h1>
            <p style={subtitleStyle}>
              Gestão das áreas clínicas e especialidades do hospital.
            </p>
            <p style={{ margin: '8px 0 0' }}>
              <Link href="/dashboard">← Voltar ao dashboard</Link>
            </p>
          </div>

          <Link href="/departments/new" style={primaryButtonStyle}>
            + Novo departamento
          </Link>
        </div>

        <div style={cardStyle}>
          <label style={{ display: 'grid', gap: 6, maxWidth: 420 }}>
            <strong>Pesquisar</strong>
            <input
              type="text"
              placeholder="Nome do departamento"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>

        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 20 }}>A carregar departamentos...</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: 20 }}>Nenhum departamento encontrado.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>
                        <Link href={`/departments/${item.id}`} style={nameLinkStyle}>
                          {item.name}
                        </Link>
                      </td>
                      <td style={tdStyle}>
                        <Link href={`/departments/${item.id}`} style={actionLinkStyle}>
                          Ver / Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
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
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 10,
  background: '#0f172a',
  color: 'white',
  textDecoration: 'none',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: 16,
  borderBottom: '1px solid #e2e8f0',
  fontSize: 14,
  background: '#f8fafc',
};

const tdStyle: React.CSSProperties = {
  padding: 16,
  borderBottom: '1px solid #f1f5f9',
  fontSize: 15,
};

const nameLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 700,
};

const actionLinkStyle: React.CSSProperties = {
  fontWeight: 600,
};