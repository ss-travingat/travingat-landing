import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { featuredProfiles } from '../db/schema';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  
  console.log(`Using database URL: ${dbUrl.substring(0, 40)}...`);
  
  const sql = neon(dbUrl);
  const db = drizzle(sql);
  
  const profilesPath = path.resolve(__dirname, '../features/featured-profiles/data/profiles.json');
  const profilesJson = fs.readFileSync(profilesPath, 'utf8');
  const profiles = JSON.parse(profilesJson);
  
  const mapped = profiles.map((p: any) => ({
    id: p.id,
    is_featured_profile: true,
    name: p.name,
    handle: p.handle,
    country: p.country,
    flag: p.flag,
    flag_code: p.flagCode,
    homeland_flag_code: p.homelandFlagCode,
    currently_in_flag_code: p.currentlyInFlagCode,
    countries: p.countries,
    media: p.media,
    collections: p.collections,
    align: p.align,
    bio: p.bio,
    interests: p.interests,
    languages: p.languages,
    homeland: p.homeland,
    currently_in: p.currentlyIn,
    socials: p.socials,
    images: p.images,
    visited_country_codes: p.visitedCountryCodes,
    country_images: p.countryImages,
    collection_images: p.collectionImages,
  }));
  
  console.log(`Upserting ${mapped.length} featured profiles...`);
  
  for (const profile of mapped) {
    await db.insert(featuredProfiles)
      .values(profile)
      .onConflictDoUpdate({
        target: featuredProfiles.id,
        set: profile
      });
  }
  
  console.log('Done!');
}

main().catch(console.error);
