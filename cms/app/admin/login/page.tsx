'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, session, isLoading, error } = useAuth();
  const [email, setEmail] = useState(session?.email ?? '');
  const [secret, setSecret] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      await login(email, secret);
      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesión';
      setFormError(message);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border border-border bg-white/5 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Acceso administrador</h1>
        <p className="mt-2 text-sm text-muted">
          Demo de login: escribe tu email y el <span className="font-semibold text-primary">X-Admin-Secret</span> que
          uses. Por ahora solo se guarda en tu navegador; la validación real se conectará más adelante.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="email">
              Email o usuario
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="secret">
              X-Admin-Secret
            </label>
            <input
              id="secret"
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          {(formError || error) && <p className="text-sm font-semibold text-red-400">{formError ?? error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Validando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
