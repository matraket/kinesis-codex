import fs from 'fs/promises';
import path from 'path';

export type WebContentRecord = {
  key: string;
  value: unknown;
};

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'web-content.json');

async function ensureStore() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    // ignore
  }

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify({}), 'utf8');
  }
}

async function readAll(): Promise<Record<string, unknown>> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, 'utf8');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function writeAll(payload: Record<string, unknown>) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(payload, null, 2), 'utf8');
}

export async function saveWebContent(key: string, value: unknown) {
  if (!key) throw new Error('Key is required');
  const store = await readAll();
  store[key] = value;
  await writeAll(store);
  return { key, value };
}

export async function loadWebContent(key: string) {
  if (!key) throw new Error('Key is required');
  const store = await readAll();
  return store[key];
}
