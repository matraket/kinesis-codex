import { getStoredSecret } from './auth-storage';

type RequestOptions = RequestInit & {
  authSecret?: string;
};

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json'
};

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
  const token = secret ?? getStoredSecret();
  return token ? { 'X-Admin-Secret': token } : {};
}

async function request(path: string, init?: RequestOptions) {
  const { authSecret, ...rest } = init ?? {};

  return fetch(buildUrl(path), {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...resolveAuthHeaders(authSecret),
      ...(rest.headers ?? {})
    }
  });
}

export const apiClient = {
  get: (path: string, options?: RequestOptions) => request(path, { method: 'GET', ...options }),
  post: (path: string, body?: unknown, options?: RequestOptions) =>
    request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options
    })
};
