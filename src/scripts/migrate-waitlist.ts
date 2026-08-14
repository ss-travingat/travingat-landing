import { getDb } from "../lib/db";

async function main() {
  const sql = getDb();
  await sql`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS explorer_card_status VARCHAR(50) DEFAULT 'Not created';`;
  await sql`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS countries_count INTEGER;`;
  await sql`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS card_style VARCHAR(50);`;
  console.log("Migration complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
