import { relations } from "drizzle-orm/relations";
import { users, explorerCards, featuredProfiles } from "./schema";

export const explorerCardsRelations = relations(explorerCards, ({one}) => ({
	user: one(users, {
		fields: [explorerCards.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	explorerCards: many(explorerCards),
	featuredProfiles: many(featuredProfiles),
}));

export const featuredProfilesRelations = relations(featuredProfiles, ({one}) => ({
	user: one(users, {
		fields: [featuredProfiles.userId],
		references: [users.id]
	}),
}));