CREATE TABLE "featured_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"handle" text NOT NULL,
	"flag" text,
	"flag_code" text,
	"homeland_flag_code" text,
	"currently_in_flag_code" text,
	"countries" integer DEFAULT 0,
	"media" integer DEFAULT 0,
	"collections" integer DEFAULT 0,
	"images" jsonb,
	"align" text DEFAULT 'end',
	"bio" text,
	"interests" jsonb,
	"languages" jsonb,
	"homeland" text,
	"currently_in" text,
	"socials" jsonb,
	"about_images" jsonb,
	"visited_country_codes" jsonb,
	"country_images" jsonb,
	"collection_images" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "featured_profiles_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"country" text,
	"avatar_url" text,
	"cover_photo_url" text,
	"visited_count" integer,
	"links" jsonb,
	"is_explorer" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"get_featured_status" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "featured_profiles" ADD CONSTRAINT "featured_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;