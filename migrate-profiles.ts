import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { featuredProfiles } from "./src/db/schema";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function main() {
  try {
    const R2_KEY = "landingpage-assets/data/profiles.json";
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: R2_KEY,
    });
    
    const response = await s3Client.send(command);
    const bodyStr = await response.Body?.transformToString();
    const profiles = JSON.parse(bodyStr || "[]");
    
    console.log(`Found ${profiles.length} profiles to migrate.`);

    for (const profile of profiles) {
      await db.insert(featuredProfiles).values({
        id: profile.id,
        name: profile.name,
        handle: profile.handle,
        country: profile.country,
        flag: profile.flag,
        flag_code: profile.flagCode,
        homeland_flag_code: profile.homelandFlagCode,
        currently_in_flag_code: profile.currentlyInFlagCode,
        countries: profile.countries,
        media: profile.media,
        collections: profile.collections,
        align: profile.align,
        bio: profile.bio,
        interests: profile.interests || [],
        languages: profile.languages || [],
        homeland: profile.homeland,
        currently_in: profile.currentlyIn,
        socials: profile.socials,
        images: profile.images,
        about_images: profile.aboutImages || [],
        visited_country_codes: profile.visitedCountryCodes || [],
        country_images: profile.countryImages || [],
        collection_images: profile.collectionImages || [],
        deleted_at: profile.deletedAt ? new Date(profile.deletedAt) : null,
        is_explorer_card: false,
        is_featured_profile: true
      });
    }

    console.log("Migration complete!");
  } catch (e) {
    console.error("Migration failed:", e);
  }
}
main();
