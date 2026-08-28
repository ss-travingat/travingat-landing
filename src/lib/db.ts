import { neon } from "@neondatabase/serverless";
import dns from "node:dns";

// Fix for Next.js 18+ undici fetch IPv6 timeout issues with Neon
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const sql = neon(process.env.DATABASE_URL, {
    fetchOptions: {
      cache: "no-store",
    },
  });
  return sql;
}
