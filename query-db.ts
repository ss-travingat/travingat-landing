import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  try {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(res);
  } catch (e) {
    console.log("Error querying tables");
  }
}
main();
