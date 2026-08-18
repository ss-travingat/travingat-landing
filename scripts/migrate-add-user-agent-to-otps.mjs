/**
 * One-time migration: adds user_agent column to the otps table
 * Run with: node scripts/migrate-add-user-agent-to-otps.mjs
 */
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Adding user_agent column to otps table...');
  try {
    await sql`
      ALTER TABLE otps ADD COLUMN IF NOT EXISTS user_agent TEXT NOT NULL DEFAULT ''
    `;
    console.log('✓ Done. user_agent column added (or already existed).');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

run();
