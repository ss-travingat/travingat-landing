const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env" });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`ALTER TABLE explorer_cards ADD COLUMN IF NOT EXISTS profile_original_ext text;`;
  await sql`ALTER TABLE explorer_cards ADD COLUMN IF NOT EXISTS cover_original_ext text;`;
  console.log("Added columns successfully.");
}
run();
