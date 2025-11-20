import { apiClient } from '@/lib/api-client';

export interface AdminSession {
  alias: string;
  createdAt: string;
}

export async function loginAdmin(payload: { alias: string; secret: string }): Promise<AdminSession> {
  const response = await apiClient.post('/api/admin/login', payload);
  if (!response.ok) {
    throw new Error('Credenciales inválidas o secret incorrecto');
  }
  return response.json();
}

export async function logoutAdmin() {
  await apiClient.post('/api/admin/logout');
}

export async function getSession(): Promise<AdminSession | null> {
  const response = await apiClient.get('/api/admin/login');
  if (!response.ok) {
    return null;
  }
  return response.json();
}
