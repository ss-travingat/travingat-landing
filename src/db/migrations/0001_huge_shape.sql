ALTER TABLE "featured_profiles" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "flag" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "flag_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "countries" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "media" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "collections" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "align" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "bio" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "interests" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "languages" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "homeland" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "currently_in" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "about_images" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "visited_country_codes" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "country_images" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "featured_profiles" ALTER COLUMN "collection_images" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "featured_profiles" ADD COLUMN "is_explorer_card" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "featured_profiles" ADD COLUMN "is_featured_profile" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "featured_profiles" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_profiles" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_explorer";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_featured";