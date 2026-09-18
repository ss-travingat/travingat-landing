import { getDrizzle } from "./src/lib/drizzle.ts";
import { otps } from "./src/db/schema.ts";
import { desc } from "drizzle-orm";
async function run() {
  const db = getDrizzle();
  const res = await db.select().from(otps).orderBy(desc(otps.createdAt)).limit(1);
  console.log(res[0]);
}
run();
