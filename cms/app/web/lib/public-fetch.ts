const baseUrl =
  process.env.NEXT_PUBLIC_WEB_API_BASE_URL?.replace(/\/$/, '') ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  '';

const adminSecret =
  process.env.NEXT_PUBLIC_ADMIN_SECRET?.trim() || process.env.ADMIN_SECRET?.trim() || '';

export async function fetchJson<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : baseUrl
    ? `${baseUrl}${path}`
    : path;

  const headers: HeadersInit = {
    ...(init?.headers ?? {}),
    ...(adminSecret ? { 'X-Admin-Secret': adminSecret } : {})
  };

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn(`Public fetch ${url} failed: ${res.status}`);
      if (fallback !== undefined) return fallback;
      throw new Error(`Request failed: ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Public fetch error on ${url}`, error);
    if (fallback !== undefined) return fallback;
    throw error;
  }
}

export type WebContent = {
  title?: string;
  subtitle?: string;
  heroUrl?: string;
  bodyHtml?: string;
};

export async function fetchWebContent(keys: string | string[]): Promise<WebContent | null> {
  const list = Array.isArray(keys) ? keys : [keys];
  for (const key of list) {
    try {
      const data = await fetchJson<{ data: WebContent | null }>(
        `/api/web-content?key=${encodeURIComponent(key)}`
      );
      if (data?.data) return data.data;
    } catch {
      // try next
    }
  }
  return null;
}
