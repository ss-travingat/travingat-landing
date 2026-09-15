import { getDb } from "../lib/db";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "../../.env.local") });

async function main() {
  const sql = getDb();
  console.log("Adding deleted_at column to users and waitlist tables...");
  
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;`;
    console.log("Added deleted_at to users");
  } catch (error) {
    console.error("Error adding deleted_at to users:", error);
  }

  try {
    await sql`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;`;
    console.log("Added deleted_at to waitlist");
  } catch (error) {
    console.error("Error adding deleted_at to waitlist:", error);
  }
  
  console.log("Migration complete.");
  process.exit(0);
}

main();
