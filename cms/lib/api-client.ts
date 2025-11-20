const baseHeaders: HeadersInit = {
  'Content-Type': 'application/json'
};

function buildUrl(path: string) {
  return path.startsWith('http') ? path : path;
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
