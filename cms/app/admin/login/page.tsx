'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      await login(password);
      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesion';
      setFormError(message);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border border-border bg-white/5 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Acceso administrador</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="password">
              Contrasena de admin
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
          {(formError || error) && <p className="text-sm font-semibold text-red-400">{formError ?? error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
