import { db } from "./src/lib/db.ts";
import { sql } from "drizzle-orm";
async function run() {
  const res = await db.execute(sql`SELECT expires_at FROM otps ORDER BY created_at DESC LIMIT 1`);
  console.log(res);
}
run();
