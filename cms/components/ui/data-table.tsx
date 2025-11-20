import type { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  emptyLabel?: string;
}

export function DataTable<T extends { id: string | number }>({ columns, data, emptyLabel }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} scope="col" className="table-heading px-4 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {emptyLabel ?? 'Sin registros'}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100">
                    {column.render ? column.render(row[column.key], row) : (row[column.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
