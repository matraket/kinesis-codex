interface StatCardProps {
  title: string;
  value: string | number;
  helper?: string;
  trend?: string;
}

export function StatCard({ title, value, helper, trend }: StatCardProps) {
  return (
    <div className="card">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {helper && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helper}</p>}
      {trend && <p className="mt-2 text-xs font-semibold text-primary">{trend}</p>}
    </div>
  );
}
