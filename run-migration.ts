import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("Migration complete");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}
main();
