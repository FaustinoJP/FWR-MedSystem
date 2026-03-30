'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { staffService, StaffUser } from '@/services/staff.service';
import { rolesService, RoleItem } from '@/services/roles.service';
import { departmentsService, DepartmentItem } from '@/services/departments.service';

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

export default function StaffDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<StaffUser | null>(null);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    roleId: '',
    departmentId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
  });

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setMessage('');

      const [userData, rolesData, departmentsData] = await Promise.all([
        staffService.getById(id),
        rolesService.list(),
        departmentsService.list(),
      ]);

      setItem(userData);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setDepartments(Array.isArray(departmentsData) ? departmentsData : []);

      setForm({
        name: userData.name || '',
        email: userData.email || '',
        roleId: userData.roleId || '',
        departmentId: userData.departmentId || '',
        status: (userData.status || 'ACTIVE') as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
      });
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Erro ao carregar profissional');
      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updated = await staffService.update(id, {
        name: form.name,
        email: form.email,
        roleId: form.roleId,
        departmentId: form.departmentId || null,
        status: form.status,
      });

      setItem(updated);
      setMessage('Profissional atualizado com sucesso.');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Erro ao atualizar profissional');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Detalhe do profissional</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>
            Ver e editar dados do profissional.
          </p>
          <p style={{ margin: '8px 0 0' }}>
            <Link href="/staff">← Voltar aos profissionais</Link>
          </p>
        </div>

        {loading ? (
          <div>A carregar...</div>
        ) : !item ? (
          <div>Profissional não encontrado.</div>
        ) : (
          <>
            <div style={cardStyle}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Badge label={`Perfil: ${item.role?.name || '-'}`} />
                <Badge label={`Departamento: ${item.department?.name || '-'}`} />
                <Badge label={`Estado: ${statusLabel(item.status)}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit} style={cardStyle}>
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
                  required
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="SUSPENDED">Suspenso</option>
                </select>
              </Field>

              {message ? (
                <p style={{ margin: 0, color: message.includes('sucesso') ? 'green' : 'red' }}>
                  {message}
                </p>
              ) : null}

              <button type="submit" style={buttonStyle} disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar alterações'}
              </button>
            </form>
          </>
        )}
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

function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        background: '#e2e8f0',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
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