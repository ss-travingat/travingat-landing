import { NextResponse } from "next/server";
import { listR2Objects, deleteR2Objects } from "@/lib/r2-upload";
import { getDrizzle } from "@/lib/drizzle";
import { featuredProfiles } from "@/db/schema";
import { getLandingAssetsCdnBase } from "@/lib/landing-assets";

export const dynamic = "force-dynamic";

const PROFILES_JSON_KEY = "landingpage-assets/data/profiles.json";
const PROFILES_ASSETS_PREFIX = "landingpage-assets/profiles/";

interface Profile {
  images: { cover: string; avatar: string; gallery: string[] };
  aboutImages?: string[];
  countryImages?: { countryCode: string; images: string[]; coverPhoto?: string; about?: string }[];
  collectionImages?: { title: string; images: string[]; coverPhoto?: string; about?: string; countryCodes?: string[] }[];
}

/**
 * Extract every image/video URL referenced by all profiles and return them
 * as a Set of R2 object keys (e.g. "landingpage-assets/profiles/cover-123.webp").
 */
function collectReferencedKeys(profiles: Profile[]): Set<string> {
  const cdnBase = getLandingAssetsCdnBase(); // e.g. "https://cdn.travingat.com/landingpage-assets"
  const urls = new Set<string>();

  for (const p of profiles) {
    if (p.images.cover) urls.add(p.images.cover);
    if (p.images.avatar) urls.add(p.images.avatar);
    for (const u of p.images.gallery) urls.add(u);
    for (const u of p.aboutImages ?? []) urls.add(u);
    for (const ci of p.countryImages ?? []) {
      for (const u of ci.images) urls.add(u);
    }
    for (const ci of p.collectionImages ?? []) {
      for (const u of ci.images) urls.add(u);
    }
  }

  // Convert CDN URLs → R2 object keys
  const keys = new Set<string>();
  for (const url of urls) {
    if (!url) continue;
    if (url.startsWith("http")) {
      // e.g. "https://cdn.travingat.com/landingpage-assets/profiles/cover-123.webp"
      //    → "landingpage-assets/profiles/cover-123.webp"
      const idx = url.indexOf("landingpage-assets/");
      if (idx >= 0) {
        keys.add(decodeURIComponent(url.slice(idx)));
      }
    } else {
      // relative path like "profiles/cover-123.webp"
      const clean = url.replace(/^\/+/, "");
      keys.add(`landingpage-assets/${clean}`);
    }
  }

  return keys;
}

/**
 * GET — scan for orphaned profile assets.
 *
 * Returns:
 *   { orphans: [{ key, url, size, lastModified }], totalR2: number, totalReferenced: number }
 */
export async function GET() {
  try {
    // 1. Read all profiles from R2
    let profiles: Profile[] = [];
    try {
      const db = getDrizzle();
      const records = await db.select().from(featuredProfiles);
      // Map DB records to the Profile interface expected by collectReferencedKeys
      profiles = records.map(p => ({
        images: {
          cover: (p.images as any)?.cover || "",
          avatar: (p.images as any)?.avatar || "",
          gallery: (p.images as any)?.gallery || []
        },
        aboutImages: (p.about_images as string[]) || [],
        countryImages: (p.country_images as any[]) || [],
        collectionImages: (p.collection_images as any[]) || []
      }));
    } catch (dbErr) {
      console.error("Failed to fetch profiles for orphans check:", dbErr);
    }

    // 2. Collect all URLs referenced by profiles
    const referencedKeys = collectReferencedKeys(profiles);

    // 3. List all objects in the profiles/ prefix
    const r2Objects = await listR2Objects(PROFILES_ASSETS_PREFIX);

    // 4. Find orphans (in R2 but not referenced by any profile)
    const cdnBase = getLandingAssetsCdnBase();
    const orphans = r2Objects
      .filter((obj) => !referencedKeys.has(obj.key))
      .map((obj) => {
        // Convert key to CDN URL for display
        const suffix = obj.key.replace("landingpage-assets/", "");
        return {
          key: obj.key,
          url: `${cdnBase}/${suffix}`,
          size: obj.size,
          lastModified: obj.lastModified,
        };
      });

    return NextResponse.json({
      orphans,
      totalR2: r2Objects.length,
      totalReferenced: referencedKeys.size,
      totalOrphaned: orphans.length,
      totalOrphanedBytes: orphans.reduce((sum, o) => sum + o.size, 0),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Orphan scan error:", message);
    return NextResponse.json(
      { error: `Failed to scan orphans: ${message}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE — delete orphaned profile assets.
 *
 * Body: { keys: string[] }  — list of R2 keys to delete
 */
export async function DELETE(request: Request) {
  try {
    const { keys } = (await request.json()) as { keys: string[] };

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: "Provide an array of keys to delete" },
        { status: 400 }
      );
    }

    // Safety: only allow deleting objects under the profiles/ prefix
    const safeKeys = keys.filter((k) => k.startsWith(PROFILES_ASSETS_PREFIX));
    if (safeKeys.length === 0) {
      return NextResponse.json(
        { error: "No valid profile asset keys provided" },
        { status: 400 }
      );
    }

    const deleted = await deleteR2Objects(safeKeys);

    console.log(`[orphan-cleanup] Deleted ${deleted} orphaned profile assets`);
    return NextResponse.json({ deleted });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Orphan delete error:", message);
    return NextResponse.json(
      { error: `Failed to delete orphans: ${message}` },
      { status: 500 }
    );
  }
}
