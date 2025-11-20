import { render, screen } from '@testing-library/react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import '@testing-library/jest-dom';

vi.mock('next/navigation', () => ({
  usePathname: () => '/leads'
}));

describe('SidebarNav', () => {
  it('resalta la ruta activa y muestra enlaces', () => {
    render(<SidebarNav />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Leads')).toHaveClass('bg-primary/10');
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
