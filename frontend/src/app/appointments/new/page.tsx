'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patientsService } from '@/services/patients.service';
import { departmentsService } from '@/services/departments.service';
import { appointmentsService } from '@/services/appointments.service';
import { staffService } from '@/services/staff.service';

function getLocalDatetimeValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get('patientId') || '';

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    patientId: preselectedPatientId,
    doctorId: '',
    departmentId: '',
    appointmentDate: getLocalDatetimeValue(),
    reason: '',
  });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (preselectedPatientId) {
      setForm((p) => ({ ...p, patientId: preselectedPatientId }));
    }
  }, [preselectedPatientId]);

  async function load() {
    try {
      const patientsData = await patientsService.list();
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      console.error('ERRO AO CARREGAR PACIENTES:', err);
      setPatients([]);
    }

    try {
      const doctorsData = await staffService.listDoctors();
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
    } catch (err) {
      console.error('ERRO AO CARREGAR MEDICOS:', err);
      setDoctors([]);
    }

    try {
      const departmentsData = await departmentsService.list();
      setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
    } catch (err) {
      console.error('ERRO AO CARREGAR DEPARTAMENTOS:', err);
      setDepartments([]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMessage('');

    try {
      const result = await appointmentsService.create({
        patientId: form.patientId,
        doctorId: form.doctorId,
        departmentId: form.departmentId,
        appointmentDate: form.appointmentDate,
        reason: form.reason || undefined,
      });

      router.push(`/appointments/${result.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Erro ao agendar consulta');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Agendar consulta</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>
            Registo de nova consulta no sistema.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
            <Link href="/dashboard">← Dashboard</Link>
            <Link href="/appointments">← Consultas</Link>
            {form.patientId ? (
              <Link href={`/patients/${form.patientId}`}>← Paciente</Link>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={cardStyle}>
          <Field label="Paciente">
            <select
              value={form.patientId}
              onChange={(e) =>
                setForm((p) => ({ ...p, patientId: e.target.value }))
              }
              style={inputStyle}
              required
            >
              <option value="">Selecione</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Médico">
            <select
              value={form.doctorId}
              onChange={(e) => {
                const doctorId = e.target.value;
                const doctor = doctors.find((d) => d.id === doctorId);

                setForm((p) => ({
                  ...p,
                  doctorId,
                  departmentId: doctor?.departmentId || p.departmentId,
                }));
              }}
              style={inputStyle}
              required
            >
              <option value="">Selecione o médico</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                  {d.department?.name ? ` - ${d.department.name}` : ''}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Departamento">
            <select
              value={form.departmentId}
              onChange={(e) =>
                setForm((p) => ({ ...p, departmentId: e.target.value }))
              }
              style={inputStyle}
              required
            >
              <option value="">Selecione o departamento</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Data e hora">
            <input
              type="datetime-local"
              value={form.appointmentDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, appointmentDate: e.target.value }))
              }
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Motivo">
            <textarea
              value={form.reason}
              onChange={(e) =>
                setForm((p) => ({ ...p, reason: e.target.value }))
              }
              style={textareaStyle}
              placeholder="Ex.: consulta de rotina, febre, dor abdominal..."
            />
          </Field>

          {message ? (
            <p style={{ color: 'red', margin: 0 }}>{message}</p>
          ) : null}

          <button type="submit" style={buttonStyle} disabled={saving}>
            {saving ? 'A guardar...' : 'Agendar consulta'}
          </button>
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
      <strong>{label}</strong>
      {children}
    </label>
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

const textareaStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  minHeight: 100,
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  border: 0,
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
};