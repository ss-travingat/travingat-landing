import { getDb } from "../src/lib/db";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const sql = getDb();
  try {
    console.log("Adding source column...");
    await sql`ALTER TABLE waitlist ADD COLUMN source VARCHAR(50) DEFAULT 'Waitlist'`;
    console.log("Column added successfully!");
  } catch (error: any) {
    if (error.message?.includes("already exists") || error.message?.includes("duplicate column")) {
      console.log("Column already exists, skipping...");
    } else {
      console.error("Migration error:", error);
    }
  }
}

main();
