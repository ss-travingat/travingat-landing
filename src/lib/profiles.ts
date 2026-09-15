import { getDrizzle } from "@/lib/drizzle";
import { featuredProfiles } from "@/db/schema";
import { desc, isNull, eq } from "drizzle-orm";
import { toLandingAssetUrl } from "@/lib/landing-assets";

function resolveImageAsset(img: any) {
  return typeof img === "string" ? img : img?.url ?? "";
}

export function normalizeProfile(p: any) {
  if (!p) return null;
  const images = p.images || { cover: "", avatar: "", gallery: [] };
  return {
    ...p,
    flagCode: p.flag_code,
    homelandFlagCode: p.homeland_flag_code,
    currentlyInFlagCode: p.currently_in_flag_code,
    aboutImages: (p.about_images ?? []).map(resolveImageAsset).map(toLandingAssetUrl),
    visitedCountryCodes: p.visited_country_codes || [],
    countryImages: p.country_images || [],
    collectionImages: p.collection_images || [],
    currentlyIn: p.currently_in,
    isExplorerCard: p.is_explorer_card,
    isFeaturedProfile: p.is_featured_profile,
    images: {
      cover: toLandingAssetUrl(resolveImageAsset(images.cover)),
      avatar: toLandingAssetUrl(resolveImageAsset(images.avatar)),
      gallery: (images.gallery || []).map((g: any) => toLandingAssetUrl(resolveImageAsset(g))),
    },
  };
}

export async function getAllActiveProfiles() {
  const db = getDrizzle();
  const profiles = await db
    .select()
    .from(featuredProfiles)
    .where(isNull(featuredProfiles.deleted_at))
    .orderBy(desc(featuredProfiles.created_at));
  
  return profiles.map(normalizeProfile);
}

export async function getProfileByHandle(handle: string) {
  const db = getDrizzle();
  const handleWithAt = handle.startsWith("@") ? handle : `@${handle}`;
  
  const profiles = await db
    .select()
    .from(featuredProfiles)
    .where(eq(featuredProfiles.handle, handleWithAt))
    .limit(1);
    
  if (profiles.length === 0 || profiles[0].deleted_at) {
    return null;
  }
  
  return normalizeProfile(profiles[0]);
}
