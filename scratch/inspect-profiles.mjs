import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const localSql = neon(process.env.DATABASE_URL);

dotenv.config({ path: ".env.prod", override: true });
const prodSql = neon(process.env.DATABASE_URL);

async function main() {
  const localProfiles = await localSql`SELECT id, user_id, handle FROM featured_profiles`;
  console.log("Local Profiles Count:", localProfiles.length);
  console.log("Local user_ids populated:", localProfiles.filter(p => p.user_id !== null).length);

  const prodProfiles = await prodSql`SELECT id, user_id, handle FROM featured_profiles`;
  console.log("Prod Profiles Count:", prodProfiles.length);
}

main().catch(console.error);
