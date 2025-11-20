import { apiClient } from '@/lib/api-client';
import type { AdminSession } from '../auth/services';

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

export interface DashboardSummary {
  leads: { total: number; open: number; closed: number; trend?: string };
  pages: { published: number; legal: number };
  settings: { active: number; outdated: boolean };
}

export async function fetchDashboard(): Promise<DashboardSummary> {
  const response = await apiClient.get('/api/admin/proxy/dashboard');
  if (!response.ok) {
    throw new Error('No se pudo obtener el dashboard');
  }
  return response.json();
}

export async function fetchLeads(params?: { status?: string; type?: string; date?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.date) searchParams.set('date', params.date);
  const response = await apiClient.get(`/api/admin/proxy/leads${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los leads');
  }
  return response.json() as Promise<LeadRow[]>;
}

export async function fetchLeadStats() {
  const response = await apiClient.get('/api/admin/proxy/leads/summary');
  if (!response.ok) {
    throw new Error('No se pudieron obtener las estadísticas de leads');
  }
  return response.json();
}

export async function fetchSession(): Promise<AdminSession | null> {
  const response = await apiClient.get('/api/admin/login');
  if (!response.ok) {
    return null;
  }
  return response.json();
}
