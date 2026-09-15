import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  try {
    await sql`DROP TABLE IF EXISTS featured_profiles CASCADE;`;
    console.log("Dropped featured_profiles");
  } catch (e) {
    console.error("Error dropping table:", e);
  }
}
main();
