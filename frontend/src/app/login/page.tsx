'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@faustware.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Falha no login');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <form onSubmit={onSubmit} style={{ background: 'white', padding: 24, borderRadius: 16, width: 360, boxShadow: '0 10px 30px rgba(0,0,0,.08)' }}>
        <h1>Faustware MedSystem</h1>
        <p>Entrar no sistema</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: 12, marginBottom: 12 }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" style={{ width: '100%', padding: 12, marginBottom: 12 }} />
        {error ? <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div> : null}
        <button disabled={loading} style={{ width: '100%', padding: 12, background: '#0f172a', color: 'white', border: 0, borderRadius: 8 }}>
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
