export function getApiBaseUrl() {
  const base = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
  return base.replace(/\/$/, '');
}
