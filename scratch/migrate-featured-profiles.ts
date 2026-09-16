import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';

async function main() {
  const localUrl = "postgresql://neondb_owner:npg_aR1iTAYjCl6J@ep-aged-base-a12fybze-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const prodUrl = "postgresql://neondb_owner:npg_aR1iTAYjCl6J@ep-purple-waterfall-a1igam6y-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

  const localSql = neon(localUrl);
  const localDb = drizzle(localSql, { schema });
  
  const localProfiles = await localDb.select().from(schema.featuredProfiles);
  console.log(`Found ${localProfiles.length} profiles in local (${localUrl.split('@')[1].split('.')[0]}).`);

  const prodSql = neon(prodUrl);
  const prodDb = drizzle(prodSql, { schema });
  
  const prodProfiles = await prodDb.select().from(schema.featuredProfiles);
  console.log(`Found ${prodProfiles.length} profiles in prod before deletion (${prodUrl.split('@')[1].split('.')[0]}).`);

  console.log("Deleting all profiles in prod...");
  await prodDb.delete(schema.featuredProfiles);
  
  if (localProfiles.length > 0) {
    console.log(`Inserting ${localProfiles.length} profiles into prod...`);
    await prodDb.insert(schema.featuredProfiles).values(localProfiles);
  }
  
  const finalProdProfiles = await prodDb.select().from(schema.featuredProfiles);
  console.log(`Prod now has ${finalProdProfiles.length} profiles.`);
}

main().catch(console.error);
