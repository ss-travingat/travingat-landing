CREATE TABLE "archived_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"source" varchar(50) NOT NULL,
	"data" jsonb NOT NULL,
	"deleted_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "explorer_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"country" varchar(255),
	"visited_countries" jsonb DEFAULT '[]'::jsonb,
	"profile_image_url" text,
	"cover_image_url" text,
	"card_style" varchar(50),
	"card_created" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"profile_original_ext" text,
	"cover_original_ext" text
);
--> statement-breakpoint
CREATE TABLE "otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"otp" varchar(10) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_agent" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"handle" text NOT NULL,
	"country" text DEFAULT '',
	"flag" text DEFAULT '',
	"flag_code" text DEFAULT '',
	"homeland_flag_code" text DEFAULT '',
	"currently_in_flag_code" text DEFAULT '',
	"countries" integer DEFAULT 0,
	"media" integer DEFAULT 0,
	"collections" integer DEFAULT 0,
	"images" jsonb DEFAULT '{"cover":"","avatar":"","gallery":[]}'::jsonb,
	"align" text DEFAULT 'end',
	"bio" text DEFAULT '',
	"interests" text[] DEFAULT '{""}',
	"languages" text[] DEFAULT '{""}',
	"homeland" text DEFAULT '',
	"currently_in" text DEFAULT '',
	"socials" jsonb DEFAULT '{"x":"","youtube":"","linkedin":"","instagram":""}'::jsonb,
	"visited_country_codes" text[] DEFAULT '{""}',
	"country_images" jsonb DEFAULT '[]'::jsonb,
	"collection_images" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "visited_countries" text[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_image_url" varchar(1024);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cover_image_url" varchar(1024);--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "browser" text;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "device" text;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "ip" text;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "confirmed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "confirmation_token" text;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "token_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "source" varchar(50) DEFAULT 'Waitlist';--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "explorer_card_status" varchar(50) DEFAULT 'Not created';--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "countries_count" integer;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "card_style" varchar(50);--> statement-breakpoint
ALTER TABLE "explorer_cards" ADD CONSTRAINT "explorer_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "otps_email_idx" ON "otps" USING btree ("email" text_ops);