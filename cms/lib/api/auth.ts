import type { StoredSession } from '../auth-storage';

export type LoginPayload = {
  email: string;
  secret: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(payload: LoginPayload): Promise<StoredSession> {
  if (!payload.secret?.trim()) {
    throw new Error('El secret es obligatorio');
  }

  // Mock de autenticación local: simulamos latencia y devolvemos la sesión en memoria.
  await wait(150);
  return { email: payload.email, secret: payload.secret };
}

export async function validateSession(session: StoredSession): Promise<StoredSession> {
  if (!session.secret?.trim()) {
    throw new Error('Sesión no válida');
  }

  // Mock: en producción este paso llamará al backend con X-Admin-Secret para validar.
  await wait(50);
  return session;
}

export async function logout() {
  // Mock: futuro -> invalidar cookie/token en backend.
  await wait(20);
}
