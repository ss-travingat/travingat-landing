import { toLandingAssetUrl } from "@/lib/landing-assets";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

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
    showBadge: p.show_badge,
    isSampleProfile: p.is_sample_profile,
    images: {
      cover: toLandingAssetUrl(resolveImageAsset(images.cover)),
      avatar: toLandingAssetUrl(resolveImageAsset(images.avatar)),
      gallery: (images.gallery || []).map((g: any) => toLandingAssetUrl(resolveImageAsset(g))),
    },
  };
}

export async function getAllActiveProfiles() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const profiles = await res.json();
    return profiles.map(normalizeProfile);
  } catch (err) {
    console.error("Failed to fetch profiles:", err);
    return [];
  }
}

export async function getProfileByHandle(handle: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/${handle}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const profile = await res.json();
    return normalizeProfile(profile);
  } catch (err) {
    console.error("Failed to fetch profile by handle:", err);
    return null;
  }
}
