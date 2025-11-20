import clsx from 'clsx';

const variants: Record<string, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
};

export function StatusPill({ label, variant = 'info' }: { label: string; variant?: keyof typeof variants }) {
  return <span className={clsx('pill', variants[variant])}>{label}</span>;
}
