/**
 * Migration: ensure waitlist table has browser, device, country, city, ip columns
 * Run with: node scripts/migrate-waitlist-tracking.mjs
 */
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Ensuring tracking columns exist on waitlist table...');
  
  const migrations = [
    `ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS browser TEXT NOT NULL DEFAULT 'Unknown'`,
    `ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS device TEXT NOT NULL DEFAULT 'Unknown'`,
    `ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'Unknown'`,
    `ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT 'Unknown'`,
    `ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS ip TEXT NOT NULL DEFAULT '0.0.0.0'`,
  ];

  for (const migration of migrations) {
    try {
      await sql.unsafe(migration);
      console.log('✓', migration.split('ADD COLUMN IF NOT EXISTS')[1]?.split(' ')[1] || migration);
    } catch (err) {
      console.error('✗ Migration error:', err.message);
    }
  }

  console.log('\nDone. All tracking columns ensured.');
}

run();
