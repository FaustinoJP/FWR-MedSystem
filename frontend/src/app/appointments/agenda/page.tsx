'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { appointmentsService } from '@/services/appointments.service';

type AgendaAppointment = {
  id: string;
  appointmentDate: string;
  status: string;
  reason?: string | null;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  doctor?: {
    id: string;
    name: string;
  };
  department?: {
    id: string;
    name: string;
  };
};

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatHour(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatLongDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

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

function sortByAppointmentDate(a: AgendaAppointment, b: AgendaAppointment) {
  return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
}

export default function MedicalAgendaPage() {
  const [appointments, setAppointments] = useState<AgendaAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSelectedDate(formatDateInput(new Date()));
    setReady(true);
  }, []);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError('');
      const data = await appointmentsService.list();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao carregar agenda');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];

    return appointments
      .filter((item) => {
        const itemDate = new Date(item.appointmentDate);
        const itemDateOnly = formatDateInput(itemDate);
        return itemDateOnly === selectedDate;
      })
      .sort(sortByAppointmentDate);
  }, [appointments, selectedDate]);

  const groupedByDoctor = useMemo(() => {
    const groups: Record<string, AgendaAppointment[]> = {};

    for (const appointment of filteredAppointments) {
      const doctorName = appointment.doctor?.name || 'Médico não definido';

      if (!groups[doctorName]) {
        groups[doctorName] = [];
      }

      groups[doctorName].push(appointment);
    }

    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredAppointments]);

  if (!ready) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>A carregar agenda...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={topNavLinkStyle}>
            ← Dashboard
          </Link>
          <Link href="/appointments" style={topNavLinkStyle}>
            ← Consultas
          </Link>
          <Link href="/appointments/new" style={topNavLinkStyle}>
            + Nova consulta
          </Link>
        </div>

        <div>
          <h1 style={{ margin: '12px 0 4px' }}>Agenda médica</h1>
          <p style={{ margin: 0, color: '#64748b' }}>
            Consultas agrupadas por médico e organizadas por horário.
          </p>
        </div>

        <div style={filterCardStyle}>
          <label style={{ display: 'grid', gap: 6, maxWidth: 260 }}>
            <strong>Data</strong>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={inputStyle}
            />
          </label>

          <div style={{ alignSelf: 'end' }}>
            <button onClick={loadAppointments} style={secondaryButtonStyle}>
              Atualizar agenda
            </button>
          </div>
        </div>

        <div style={agendaHeaderStyle}>
          <strong>Agenda — {selectedDate ? formatLongDate(selectedDate) : '-'}</strong>
        </div>

        {loading && <p>A carregar agenda...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && groupedByDoctor.length === 0 && (
          <div style={emptyCardStyle}>
            <p style={{ margin: 0 }}>Não há consultas agendadas para esta data.</p>
          </div>
        )}

        {!loading && !error && groupedByDoctor.length > 0 && (
          <div style={{ display: 'grid', gap: 20 }}>
            {groupedByDoctor.map(([doctorName, doctorAppointments]) => (
              <section key={doctorName} style={doctorCardStyle}>
                <div style={doctorHeaderStyle}>
                  <h2 style={{ margin: 0 }}>{doctorName}</h2>
                  <span style={doctorCountStyle}>
                    {doctorAppointments.length} consulta
                    {doctorAppointments.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Hora</th>
                        <th style={thStyle}>Paciente</th>
                        <th style={thStyle}>Departamento</th>
                        <th style={thStyle}>Motivo</th>
                        <th style={thStyle}>Estado</th>
                        <th style={thStyle}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td style={tdStyle}>{formatHour(appointment.appointmentDate)}</td>
                          <td style={tdStyle}>
                            {appointment.patient
                              ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                              : '-'}
                          </td>
                          <td style={tdStyle}>{appointment.department?.name || '-'}</td>
                          <td style={tdStyle}>{appointment.reason || '-'}</td>
                          <td style={tdStyle}>{statusLabel(appointment.status)}</td>
                          <td style={tdStyle}>
                            <Link href={`/appointments/${appointment.id}`}>Ver consulta</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
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

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 20,
};

const filterCardStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  alignItems: 'end',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 16,
};

const agendaHeaderStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#fff',
  borderRadius: 12,
  padding: '14px 18px',
  fontSize: 18,
};

const emptyCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 20,
};

const doctorCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 16,
  display: 'grid',
  gap: 12,
};

const doctorHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

const doctorCountStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 999,
  background: '#e2e8f0',
  fontSize: 13,
  fontWeight: 600,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: 12,
  borderBottom: '1px solid #e2e8f0',
  fontSize: 14,
};

const tdStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: '1px solid #f1f5f9',
  fontSize: 14,
  verticalAlign: 'top',
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  cursor: 'pointer',
};