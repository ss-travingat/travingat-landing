import { drizzle } from 'drizzle-orm/neon-http';
import { getDb } from './db';
import * as schema from '../db/schema';

export function getDrizzle() {
  const sql = getDb();
  return drizzle(sql, { schema });
}
