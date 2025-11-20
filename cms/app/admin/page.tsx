export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-white">Dashboard</h3>
      <p className="text-sm text-muted">Aquí verás métricas y resúmenes cuando conectemos los datos.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-white/5 p-4">
          <p className="text-sm text-muted">Leads totales</p>
          <p className="text-3xl font-bold">—</p>
        </div>
        <div className="rounded-xl border border-border bg-white/5 p-4">
          <p className="text-sm text-muted">Páginas publicadas</p>
          <p className="text-3xl font-bold">—</p>
        </div>
      </div>
    </section>
  );
}
