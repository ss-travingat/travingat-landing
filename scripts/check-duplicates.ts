import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Checking for duplicates...");
  const result = await db.execute(sql`
    SELECT user_id, COUNT(*)
    FROM explorer_cards
    GROUP BY user_id
    HAVING COUNT(*) > 1
  `);
  console.log("Duplicates:", result.rows);
  process.exit(0);
}
main().catch(console.error);
