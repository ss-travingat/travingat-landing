import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  country: text("country"),
  visited_count: integer("visited_count"),
  links: jsonb("links").$type<string[]>(),
  created_at: timestamp("created_at").defaultNow(),
});

export const waitlist = pgTable("waitlist", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  get_featured_status: text("get_featured_status"),
  created_at: timestamp("created_at").defaultNow(),
});
