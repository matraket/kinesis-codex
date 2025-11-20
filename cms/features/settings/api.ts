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
  const payload = await response.json();
  if (Array.isArray(payload)) {
    return payload as SettingRow[];
  }
  if (Array.isArray(payload?.data)) {
    return payload.data as SettingRow[];
  }
  if (Array.isArray(payload?.items)) {
    return payload.items as SettingRow[];
  }
  return [];
}
