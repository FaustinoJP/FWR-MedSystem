'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function StaffDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await staffService.getById(id);
      setItem(data);
    } catch (err) {
      console.error(err);
      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 820, display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0 }}>Detalhe do profissional</h1>
        <p style={{ margin: '8px 0 0' }}>
          <Link href="/staff">← Voltar aos profissionais</Link>
        </p>
      </div>

      {loading ? (
        <div>A carregar...</div>
      ) : !item ? (
        <div>Profissional não encontrado.</div>
      ) : (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 20,
            display: 'grid',
            gap: 14,
          }}
        >
          <Row label="Nome" value={item.name} />
          <Row label="Email" value={item.email} />
          <Row label="Perfil" value={item.role?.name || '-'} />
          <Row label="Departamento" value={item.department?.name || '-'} />
          <Row label="Estado" value={statusLabel(item.status)} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: 12,
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: 10,
      }}
    >
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}