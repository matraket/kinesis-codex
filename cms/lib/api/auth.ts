import { clearStoredSession, type StoredSession } from '../auth-storage';
import { apiClient } from '../api-client';

export type LoginCredentials = {
  secret: string;
};

type DashboardSummaryResponse = {
  leads: { total: number; open: number; closed: number; trend?: string };
  pages: { published: number; legal: number };
  settings: { active: number; outdated: boolean };
};

async function verifySecretAgainstBackend(secret: string): Promise<DashboardSummaryResponse> {
  let response: Response;
  try {
    response = await apiClient.get('/api/admin/dashboard', { authSecret: secret });
  } catch (error) {
    console.error('No se pudo contactar con la API admin:', error);
    throw new Error('No se puede conectar con la API. Asegurate de que el backend este corriendo.');
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('Contrasena incorrecta');
  }

  if (!response.ok) {
    let message = `Error del backend (${response.status})`;
    try {
      const payload = await response.json();
      if (payload && typeof payload.error === 'string') {
        message = payload.error;
      }
    } catch {
      // ignorado
    }
    throw new Error(message);
  }

  return response.json() as Promise<DashboardSummaryResponse>;
}

/**
 * Realiza login contra la API admin usando el header `X-Admin-Secret`.
 * El endpoint `/api/admin/dashboard` actua como verificacion del secret.
 */
export async function login(credentials: LoginCredentials): Promise<StoredSession> {
  if (!credentials.secret?.trim()) {
    throw new Error('La contrasena es obligatoria');
  }

  await verifySecretAgainstBackend(credentials.secret);
  return { secret: credentials.secret, createdAt: Date.now() };
}

export async function validateSession(session: StoredSession): Promise<StoredSession> {
  if (!session.secret?.trim()) {
    throw new Error('Sesion no valida');
  }

  await verifySecretAgainstBackend(session.secret);
  return session;
}

export async function logout() {
  clearStoredSession();
}
