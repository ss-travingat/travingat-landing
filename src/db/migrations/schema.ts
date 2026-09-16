import { pgTable, text, integer, jsonb, timestamp, uuid, varchar, foreignKey, unique, boolean, serial, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const profiles = pgTable("profiles", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	handle: text().notNull(),
	country: text().default('),
	flag: text().default('),
	flagCode: text("flag_code").default('),
	homelandFlagCode: text("homeland_flag_code").default('),
	currentlyInFlagCode: text("currently_in_flag_code").default('),
	countries: integer().default(0),
	media: integer().default(0),
	collections: integer().default(0),
	images: jsonb().default({"cover":"","avatar":"","gallery":[]}),
	align: text().default('end'),
	bio: text().default('),
	interests: text().array().default([""]),
	languages: text().array().default([""]),
	homeland: text().default('),
	currentlyIn: text("currently_in").default('),
	socials: jsonb().default({"x":"","youtube":"","linkedin":"","instagram":""}),
	visitedCountryCodes: text("visited_country_codes").array().default([""]),
	countryImages: jsonb("country_images").default([]),
	collectionImages: jsonb("collection_images").default([]),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const archivedUsers = pgTable("archived_users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	originalId: varchar("original_id", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	source: varchar({ length: 50 }).notNull(),
	data: jsonb().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const explorerCards = pgTable("explorer_cards", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	country: varchar({ length: 255 }),
	visitedCountries: jsonb("visited_countries").default([]),
	profileImageUrl: text("profile_image_url"),
	coverImageUrl: text("cover_image_url"),
	cardStyle: varchar("card_style", { length: 50 }),
	cardCreated: boolean("card_created").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	profileOriginalExt: text("profile_original_ext"),
	coverOriginalExt: text("cover_original_ext"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "explorer_cards_user_id_fkey"
		}).onDelete("cascade"),
	unique("explorer_cards_user_id_key").on(table.userId),
]);

export const waitlist = pgTable("waitlist", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	browser: text(),
	device: text(),
	country: text(),
	city: text(),
	ip: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	confirmed: boolean().default(false).notNull(),
	confirmationToken: text("confirmation_token"),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
	tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true, mode: 'string' }),
	source: varchar({ length: 50 }).default('Waitlist'),
	explorerCardStatus: varchar("explorer_card_status", { length: 50 }).default('Not created'),
	countriesCount: integer("countries_count"),
	cardStyle: varchar("card_style", { length: 50 }),
	getFeaturedStatus: varchar("get_featured_status").default('Not created'),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	unique("waitlist_email_key").on(table.email),
	unique("waitlist_confirmation_token_key").on(table.confirmationToken),
]);

export const otps = pgTable("otps", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	otp: varchar({ length: 10 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	userAgent: text("user_agent").default(').notNull(),
}, (table) => [
	index("otps_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	email: varchar({ length: 255 }),
	country: varchar({ length: 255 }),
	visitedCountries: text("visited_countries").array(),
	profileImageUrl: varchar("profile_image_url", { length: 1024 }),
	coverImageUrl: varchar("cover_image_url", { length: 1024 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	links: text().array(),
	visitedCount: integer("visited_count"),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	avatarUrl: text("avatar_url"),
	coverPhotoUrl: text("cover_photo_url"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const featuredProfiles = pgTable("featured_profiles", {
	id: text().primaryKey().notNull(),
	userId: uuid("user_id"),
	email: text(),
	isExplorerCard: boolean("is_explorer_card").default(false),
	isFeaturedProfile: boolean("is_featured_profile").default(false),
	name: text().notNull(),
	handle: text().notNull(),
	country: text().notNull(),
	flag: text().notNull(),
	flagCode: text("flag_code").notNull(),
	homelandFlagCode: text("homeland_flag_code"),
	currentlyInFlagCode: text("currently_in_flag_code"),
	countries: integer().default(0).notNull(),
	media: integer().default(0).notNull(),
	collections: integer().default(0).notNull(),
	align: text().default('end').notNull(),
	bio: text().notNull(),
	interests: jsonb().default([]),
	languages: jsonb().default([]),
	homeland: text().notNull(),
	currentlyIn: text("currently_in").notNull(),
	socials: jsonb(),
	images: jsonb(),
	aboutImages: jsonb("about_images").default([]),
	visitedCountryCodes: jsonb("visited_country_codes").default([]),
	countryImages: jsonb("country_images").default([]),
	collectionImages: jsonb("collection_images").default([]),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "featured_profiles_user_id_users_id_fk"
		}),
	unique("featured_profiles_handle_unique").on(table.handle),
]);
