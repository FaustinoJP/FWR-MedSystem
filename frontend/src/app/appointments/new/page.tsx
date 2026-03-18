'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { patientsService } from '@/services/patients.service';
import { departmentsService } from '@/services/departments.service';
import { appointmentsService } from '@/services/appointments.service';
import { staffService } from '@/services/staff.service';

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
    appointmentDate: '',
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
    console.log('PATIENTS:', patientsData);
    setPatients(Array.isArray(patientsData) ? patientsData : []);
  } catch (err) {
    console.error('ERRO AO CARREGAR PACIENTES:', err);
    setPatients([]);
  }

  try {
    const doctorsData = await staffService.listDoctors();
    console.log('DOCTORS:', doctorsData);
    setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
  } catch (err) {
    console.error('ERRO AO CARREGAR MEDICOS:', err);
    setDoctors([]);
  }

  try {
    const departmentsData = await departmentsService.list();
    console.log('DEPARTMENTS:', departmentsData);
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

      setMessage('Consulta agendada com sucesso.');
      router.push(`/appointments/${result.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Erro ao agendar consulta');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/dashboard" style={topNavLinkStyle}>
          ← Dashboard
        </Link>
        <Link href="/appointments" style={topNavLinkStyle}>
          ← Consultas
        </Link>
        {form.patientId ? (
          <Link href={`/patients/${form.patientId}`} style={topNavLinkStyle}>
            ← Paciente
          </Link>
        ) : null}
      </div>

      <div>
        <h1 style={{ margin: '12px 0 4px' }}>Agendar consulta</h1>
        <p style={{ margin: 0, color: '#64748b' }}>
          Registo de nova consulta no sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
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
          />
        </Field>

        {message ? (
          <p style={{ color: message.includes('sucesso') ? 'green' : 'red' }}>
            {message}
          </p>
        ) : null}

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? 'A guardar...' : 'Agendar consulta'}
        </button>
      </form>
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

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
};

const textareaStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  minHeight: 80,
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  border: 0,
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
};