import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool() {
  // Vercel's native Postgres storage exposes DATABASE_URL; fall back to
  // POSTGRES_URL in case an older-style integration only set that one.
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({ connectionString, max: 5 });
}

// Lazily create the pool on first real use, not at module load time.
// Next.js's build step imports every route to analyze it ("Collecting page
// data"), which would otherwise construct the pool - and fail the build -
// before any environment variables from a linked Postgres store are relevant.
function getPool(): Pool {
  if (!globalThis.__pgPool) {
    globalThis.__pgPool = createPool();
  }
  return globalThis.__pgPool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
