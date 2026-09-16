import { pgTable, text, timestamp, integer, jsonb, uuid, boolean, varchar, serial, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  handle: text("handle").notNull(),
  country: text("country").default(''),
  flag: text("flag").default(''),
  flagCode: text("flag_code").default(''),
  homelandFlagCode: text("homeland_flag_code").default(''),
  currentlyInFlagCode: text("currently_in_flag_code").default(''),
  countries: integer("countries").default(0),
  media: integer("media").default(0),
  collections: integer("collections").default(0),
  images: jsonb("images").default({"cover":"","avatar":"","gallery":[]}),
  align: text("align").default('end'),
  bio: text("bio").default(''),
  interests: text("interests").array().default([""]),
  languages: text("languages").array().default([""]),
  homeland: text("homeland").default(''),
  currentlyIn: text("currently_in").default(''),
  socials: jsonb("socials").default({"x":"","youtube":"","linkedin":"","instagram":""}),
  visitedCountryCodes: text("visited_country_codes").array().default([""]),
  countryImages: jsonb("country_images").default([]),
  collectionImages: jsonb("collection_images").default([]),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const archivedUsers = pgTable("archived_users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  originalId: varchar("original_id", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  source: varchar("source", { length: 50 }).notNull(),
  data: jsonb("data").notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const otps = pgTable("otps", {
  id: serial("id").primaryKey().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  otp: varchar("otp", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  userAgent: text("user_agent").default('').notNull(),
}, (table) => [
  index("otps_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(), // The DB had varchar, but text is fine, just be careful with constraints
  first_name: text("first_name"),
  last_name: text("last_name"),
  country: text("country"),
  avatar_url: text("avatar_url"),
  cover_photo_url: text("cover_photo_url"),
  visited_count: integer("visited_count"),
  links: text("links").array(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
  deleted_at: timestamp("deleted_at"),
  // restored columns
  visited_countries: text("visited_countries").array(),
  profile_image_url: varchar("profile_image_url", { length: 1024 }),
  cover_image_url: varchar("cover_image_url", { length: 1024 }),
});

export const explorerCards = pgTable("explorer_cards", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  country: varchar("country", { length: 255 }),
  visitedCountries: jsonb("visited_countries").default([]),
  profileImageUrl: text("profile_image_url"),
  coverImageUrl: text("cover_image_url"),
  cardStyle: varchar("card_style", { length: 50 }),
  cardCreated: boolean("card_created").default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  profileOriginalExt: text("profile_original_ext"),
  coverOriginalExt: text("cover_original_ext"),
});

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(), // Using serial since migrations says so
  email: text("email").notNull().unique(),
  get_featured_status: text("get_featured_status"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
  deleted_at: timestamp("deleted_at"),
  // restored columns
  browser: text("browser"),
  device: text("device"),
  country: text("country"),
  city: text("city"),
  ip: text("ip"),
  confirmed: boolean("confirmed").default(false).notNull(),
  confirmation_token: text("confirmation_token"), // keeping camelCase off if possible, but matching db name
  confirmed_at: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
  token_expires_at: timestamp("token_expires_at", { withTimezone: true, mode: 'string' }),
  source: varchar("source", { length: 50 }).default('Waitlist'),
  explorer_card_status: varchar("explorer_card_status", { length: 50 }).default('Not created'),
  countries_count: integer("countries_count"),
  card_style: varchar("card_style", { length: 50 }),
});

export const featuredProfiles = pgTable("featured_profiles", {
  id: text("id").primaryKey(),
  user_id: uuid("user_id").references(() => users.id),
  email: text("email"),
  is_explorer_card: boolean("is_explorer_card").default(false),
  is_featured_profile: boolean("is_featured_profile").default(false),
  name: text("name").notNull(),
  handle: text("handle").notNull().unique(),
  country: text("country").notNull(),
  flag: text("flag").notNull(),
  flag_code: text("flag_code").notNull(),
  homeland_flag_code: text("homeland_flag_code"),
  currently_in_flag_code: text("currently_in_flag_code"),
  countries: integer("countries").notNull().default(0),
  media: integer("media").notNull().default(0),
  collections: integer("collections").notNull().default(0),
  align: text("align").notNull().default("end"),
  bio: text("bio").notNull(),
  interests: jsonb("interests").$type<string[]>().default([]),
  languages: jsonb("languages").$type<string[]>().default([]),
  homeland: text("homeland").notNull(),
  currently_in: text("currently_in").notNull(),
  socials: jsonb("socials").$type<{ x?: string; instagram?: string; linkedin?: string; youtube?: string }>(),
  images: jsonb("images").$type<{ cover: string; avatar: string; gallery: string[] }>(),
  about_images: jsonb("about_images").$type<string[]>().default([]),
  visited_country_codes: jsonb("visited_country_codes").$type<string[]>().default([]),
  country_images: jsonb("country_images").$type<{ countryCode: string; images: string[]; coverPhoto?: string; about?: string }[]>().default([]),
  collection_images: jsonb("collection_images").$type<{ title: string; images: string[]; coverPhoto?: string; about?: string; countryCodes?: string[] }[]>().default([]),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
  deleted_at: timestamp("deleted_at"),
});
