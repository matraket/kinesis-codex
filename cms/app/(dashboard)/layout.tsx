import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex min-h-screen flex-col md:grid md:grid-cols-[260px_1fr]">
        <SidebarNav />
        <div className="flex min-h-screen flex-col">
          <TopBar />
          <main id="main" className="container-page flex flex-1 flex-col gap-6 py-6">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
