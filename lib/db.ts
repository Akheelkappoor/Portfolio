// Provides query() used in API routes
import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var __dbPool__: Pool | undefined
}

export function getDb() {
  if (!global.__dbPool__) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL is not set")
    // Always enable SSL with rejectUnauthorized: false for RDS compatibility
    // SSL is required by RDS but we need to accept self-signed certs through SSH tunnel
    global.__dbPool__ = new Pool({
      connectionString: url,
      max: 5,
      ssl: { rejectUnauthorized: false },
    })
  }
  return global.__dbPool__
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const pool = getDb()
  return pool.query(text, params)
}
