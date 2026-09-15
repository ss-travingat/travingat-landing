import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "featured_profiles" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" uuid,
        "email" text,
        "is_explorer_card" boolean DEFAULT false,
        "is_featured_profile" boolean DEFAULT false,
        "name" text NOT NULL,
        "handle" text NOT NULL,
        "country" text NOT NULL,
        "flag" text NOT NULL,
        "flag_code" text NOT NULL,
        "homeland_flag_code" text,
        "currently_in_flag_code" text,
        "countries" integer DEFAULT 0 NOT NULL,
        "media" integer DEFAULT 0 NOT NULL,
        "collections" integer DEFAULT 0 NOT NULL,
        "align" text DEFAULT 'end' NOT NULL,
        "bio" text NOT NULL,
        "interests" jsonb DEFAULT '[]'::jsonb,
        "languages" jsonb DEFAULT '[]'::jsonb,
        "homeland" text NOT NULL,
        "currently_in" text NOT NULL,
        "socials" jsonb,
        "images" jsonb,
        "about_images" jsonb DEFAULT '[]'::jsonb,
        "visited_country_codes" jsonb DEFAULT '[]'::jsonb,
        "country_images" jsonb DEFAULT '[]'::jsonb,
        "collection_images" jsonb DEFAULT '[]'::jsonb,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        "deleted_at" timestamp,
        CONSTRAINT "featured_profiles_handle_unique" UNIQUE("handle")
      );
    `;
    await sql`
      ALTER TABLE "featured_profiles" ADD CONSTRAINT "featured_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
    `;
    console.log("Created featured_profiles");
  } catch (e) {
    console.error("Error creating table:", e);
  }
}
main();
