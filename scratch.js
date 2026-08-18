import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
async function run() {
  await sql`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS get_featured_status VARCHAR DEFAULT 'Not created'`;
  console.log("Migration successful");
}
run();
