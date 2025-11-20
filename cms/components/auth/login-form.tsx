'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/features/auth/hooks';
import { useToast } from '@/components/feedback/toast-provider';

export function LoginForm() {
  const { submit } = useLogin();
  const router = useRouter();
  const { push } = useToast();
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await submit({ secret });
      push({ title: 'Sesión iniciada', description: 'Bienvenido de nuevo' });
      router.replace('/');
    } catch (error) {
      console.error(error);
      push({ title: 'Error al iniciar sesión', description: 'Verifica el admin secret e intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} aria-label="Formulario de acceso">
      <div>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="secret">
          Admin secret
        </label>
        <input
          id="secret"
          name="secret"
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
          placeholder="••••••"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Validando...' : 'Ingresar'}
      </button>
    </form>
  );
}
