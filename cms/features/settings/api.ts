import { apiClient } from '@/lib/api-client';

export interface SettingRow {
  id: string;
  key: string;
  value: string;
  category: 'site' | 'social' | 'legal' | 'other';
  updatedAt: string;
}

export async function fetchSettings(): Promise<SettingRow[]> {
  const response = await apiClient.get('/api/admin/proxy/settings');
  if (!response.ok) {
    throw new Error('No se pudieron obtener las configuraciones');
  }
  return response.json();
}
