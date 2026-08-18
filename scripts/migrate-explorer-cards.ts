import { getDb } from "../src/lib/db";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const sql = getDb();
  try {
    console.log("Creating explorer_cards table...");
    await sql`
      CREATE TABLE IF NOT EXISTS explorer_cards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        name VARCHAR(255),
        email VARCHAR(255),
        country VARCHAR(255),
        visited_countries JSONB DEFAULT '[]'::jsonb,
        profile_image_url TEXT,
        cover_image_url TEXT,
        card_style VARCHAR(50),
        card_created BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log("explorer_cards table created successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

main();
