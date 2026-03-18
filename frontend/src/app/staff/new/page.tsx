'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { staffService } from '@/services/staff.service';
import { rolesService, RoleItem } from '@/services/roles.service';
import { departmentsService, DepartmentItem } from '@/services/departments.service';

export default function NewStaffPage() {
  const router = useRouter();

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    departmentId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [rolesData, departmentsData] = await Promise.all([
        rolesService.list(),
        departmentsService.list(),
      ]);

      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setDepartments(Array.isArray(departmentsData) ? departmentsData : []);

      const defaultRole =
        rolesData.find((r) => r.name === 'MEDICO') || rolesData[0];

      if (defaultRole) {
        setForm((prev) => ({
          ...prev,
          roleId: prev.roleId || defaultRole.id,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const created = await staffService.create({
        name: form.name,
        email: form.email,
        password: form.password,
        roleId: form.roleId,
        departmentId: form.departmentId || undefined,
        status: form.status,
      });

      router.push(`/staff/${created.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Erro ao criar profissional');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 760, display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0 }}>Novo profissional</h1>
        <p style={{ margin: '6px 0 0', color: '#64748b' }}>
          Criar médico, enfermeiro, rececionista ou utilizador de faturação.
        </p>
        <p style={{ margin: '8px 0 0' }}>
          <Link href="/staff">← Voltar aos profissionais</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <Field label="Nome">
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            style={inputStyle}
            required
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            style={inputStyle}
            required
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            style={inputStyle}
            required
          />
        </Field>

        <Field label="Perfil">
          <select
            value={form.roleId}
            onChange={(e) => setForm((p) => ({ ...p, roleId: e.target.value }))}
            style={inputStyle}
            required
          >
            <option value="">Selecione o perfil</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
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
          >
            <option value="">Sem departamento</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Estado">
          <select
            value={form.status}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
              }))
            }
            style={inputStyle}
          >
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="SUSPENDED">Suspenso</option>
          </select>
        </Field>

        {message ? (
          <p style={{ color: 'red', margin: 0 }}>{message}</p>
        ) : null}

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? 'A guardar...' : 'Criar profissional'}
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

const inputStyle: React.CSSProperties = {
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