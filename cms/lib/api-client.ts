import { getStoredSecret } from './auth-storage';

type RequestOptions = RequestInit & {
  authSecret?: string;
};

const envAdminSecret =
  process.env.NEXT_PUBLIC_ADMIN_SECRET?.trim() || process.env.ADMIN_SECRET?.trim() || '';

function getBaseUrl() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? '';
  if (!rawBaseUrl) return '';
  return rawBaseUrl.replace(/\/$/, '');
}

function buildUrl(path: string) {
  if (path.startsWith('http')) return path;

  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    if (path.startsWith('/')) return path;
    return `/${path}`;
  }

  if (path.startsWith('/')) return `${baseUrl}${path}`;

  return `${baseUrl}/${path}`;
}

function resolveAuthHeaders(secret?: string): HeadersInit {
  const token = secret ?? getStoredSecret() ?? envAdminSecret;
  return token ? { 'X-Admin-Secret': token } : {};
}

async function request(path: string, init?: RequestOptions) {
  const { authSecret, ...rest } = init ?? {};
  const headers: HeadersInit = {
    ...resolveAuthHeaders(authSecret),
    ...(rest.headers ?? {})
  };

  if (rest.body && !('Content-Type' in headers)) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(buildUrl(path), {
    ...rest,
    headers
  });
}

export const apiClient = {
  get: (path: string, options?: RequestOptions) => request(path, { method: 'GET', ...options }),
  post: (path: string, body?: unknown, options?: RequestOptions) =>
    request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options
    }),
  del: (path: string, options?: RequestOptions) =>
    request(path, {
      method: 'DELETE',
      ...options
    })
};
