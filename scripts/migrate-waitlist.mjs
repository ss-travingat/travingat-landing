import { neon } from "@neondatabase/serverless";
import "dotenv/config";

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      browser TEXT,
      device TEXT,
      country TEXT,
      city TEXT,
      ip TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log("✅ waitlist table created");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
