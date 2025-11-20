const baseHeaders: HeadersInit = {
  'Content-Type': 'application/json'
};

function buildUrl(path: string) {
  if (path.startsWith('http')) return path;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? '';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}${path}`;
}

async function request(path: string, init?: RequestInit) {
  const url = buildUrl(path);
  return fetch(url, {
    credentials: 'include',
    headers: {
      ...baseHeaders,
      ...(init?.headers ?? {})
    },
    ...init
  });
}

export const apiClient = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body?: unknown) =>
    request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
};
