'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { appointmentsService } from '@/services/appointments.service';
import { Appointment } from '@/types';

function statusLabel(status: string) {
  switch (status) {
    case 'SCHEDULED':
      return 'Agendada';
    case 'CHECKED_IN':
      return 'Check-in';
    case 'IN_TRIAGE':
      return 'Em triagem';
    case 'IN_CONSULTATION':
      return 'Em consulta';
    case 'COMPLETED':
      return 'Concluída';
    case 'CANCELLED':
      return 'Cancelada';
    case 'NO_SHOW':
      return 'Faltou';
    default:
      return status;
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'SCHEDULED':
      return '#2563eb';
    case 'CHECKED_IN':
      return '#7c3aed';
    case 'IN_TRIAGE':
      return '#ea580c';
    case 'IN_CONSULTATION':
      return '#0891b2';
    case 'COMPLETED':
      return '#16a34a';
    case 'CANCELLED':
      return '#dc2626';
    case 'NO_SHOW':
      return '#6b7280';
    default:
      return '#0f172a';
  }
}

export default function AppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await appointmentsService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((a) => {
      const patientName =
        `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`.toLowerCase();
      const doctorName = `${a.doctor?.name || ''}`.toLowerCase();
      const departmentName = `${a.department?.name || ''}`.toLowerCase();
      const reason = `${a.reason || ''}`.toLowerCase();
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        patientName.includes(query) ||
        doctorName.includes(query) ||
        departmentName.includes(query) ||
        reason.includes(query);

      const matchesStatus = !statusFilter || a.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>Consultas</h1>
            <p style={subtitleStyle}>
              Lista de consultas registadas no sistema.
            </p>
            <p style={{ margin: '8px 0 0' }}>
              <Link href="/dashboard">← Voltar ao dashboard</Link>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/appointments/agenda" style={secondaryButtonStyle}>
              Agenda médica
            </Link>

            <Link href="/appointments/new" style={primaryButtonStyle}>
              + Nova consulta
            </Link>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={filtersRowStyle}>
            <label style={{ display: 'grid', gap: 6, minWidth: 280, flex: 1 }}>
              <strong>Pesquisar</strong>
              <input
                type="text"
                placeholder="Paciente, médico, departamento ou motivo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: 'grid', gap: 6, minWidth: 220 }}>
              <strong>Estado</strong>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="">Todos</option>
                <option value="SCHEDULED">Agendada</option>
                <option value="CHECKED_IN">Check-in</option>
                <option value="IN_TRIAGE">Em triagem</option>
                <option value="IN_CONSULTATION">Em consulta</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELLED">Cancelada</option>
                <option value="NO_SHOW">Faltou</option>
              </select>
            </label>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 20 }}>A carregar consultas...</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: 20 }}>Nenhuma consulta encontrada.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Paciente</th>
                    <th style={thStyle}>Médico</th>
                    <th style={thStyle}>Departamento</th>
                    <th style={thStyle}>Data e hora</th>
                    <th style={thStyle}>Motivo</th>
                    <th style={thStyle}>Estado</th>
                    <th style={thStyle}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((a) => (
                    <tr key={a.id}>
                      <td style={tdStyle}>
                        <Link href={`/appointments/${a.id}`} style={nameLinkStyle}>
                          {a.patient?.firstName} {a.patient?.lastName}
                        </Link>
                      </td>
                      <td style={tdStyle}>{a.doctor?.name || '-'}</td>
                      <td style={tdStyle}>{a.department?.name || '-'}</td>
                      <td style={tdStyle}>
                        {new Date(a.appointmentDate).toLocaleString('pt-PT')}
                      </td>
                      <td style={tdStyle}>{a.reason || '-'}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            color: statusColor(a.status),
                            fontWeight: 700,
                          }}
                        >
                          {statusLabel(a.status)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <Link href={`/appointments/${a.id}`} style={actionLinkStyle}>
                          Ver
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

const filtersRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 10,
  background: '#0f172a',
  color: 'white',
  textDecoration: 'none',
  fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#0f172a',
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
  verticalAlign: 'middle',
};

const nameLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 700,
};

const actionLinkStyle: React.CSSProperties = {
  fontWeight: 600,
};