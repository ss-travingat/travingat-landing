ALTER TABLE "users" ALTER COLUMN "links" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "explorer_cards" ADD CONSTRAINT "explorer_cards_user_id_unique" UNIQUE("user_id");