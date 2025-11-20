import { LoginForm } from '@/components/auth/login-form';
import { StatusPill } from '@/components/ui/status-pill';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Kinesis</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Acceso administrador</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Inicia sesión solo con tu admin secret</p>
        </div>
        <StatusPill label="Puente temporal con X-Admin-Secret" variant="warning" />
        <LoginForm />
      </div>
    </div>
  );
}
