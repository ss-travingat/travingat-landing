import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("No DATABASE_URL");
  }
  const sql = neon(process.env.DATABASE_URL);
  
  console.log("Altering users links column...");
  
  try {
    await sql`ALTER TABLE "users" ALTER COLUMN "links" SET DATA TYPE text[];`;
    console.log("Successfully altered links column.");
  } catch (e) {
    console.error("Error altering column:");
    console.error(e);
  }
}

main().catch(console.error);
