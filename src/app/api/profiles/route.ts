import { NextResponse } from "next/server";
import { getDrizzle } from "@/lib/drizzle";
import { featuredProfiles, users } from "@/db/schema";
import { eq, desc, isNull, or, ilike } from "drizzle-orm";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveImageAsset(img: any) {
  return typeof img === "string" ? img : img?.url ?? "";
}

function normalizeProfile(p: any) {
  const images = p.images || { cover: "", avatar: "", gallery: [] };
  return {
    ...p,
    // Provide backwards compatibility for UI which expects camelCase properties
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

export async function GET() {
  try {
    const db = getDrizzle();
    const activeProfiles = await db
      .select()
      .from(featuredProfiles)
      .where(isNull(featuredProfiles.deleted_at))
      .orderBy(desc(featuredProfiles.created_at));

    return NextResponse.json(activeProfiles.map(normalizeProfile));
  } catch (err) {
    console.error("Failed to fetch profiles:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, handle, email } = body;

    if (!name || !handle) {
      return NextResponse.json(
        { error: "Name and handle are required" },
        { status: 400 }
      );
    }

    const db = getDrizzle();
    const handleWithAt = handle.startsWith("@") ? handle : `@${handle}`;
    const newId = uuidv4();
    let userId = null;

    if (email) {
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        const userInsertResult = await db.insert(users).values({
          email: email,
          first_name: name.split(" ")[0],
          last_name: name.split(" ").slice(1).join(" ") || undefined,
          country: body.country || undefined,
          avatar_url: body.images?.avatar || undefined,
          cover_photo_url: body.images?.cover || undefined,
        }).returning({ id: users.id });
        userId = userInsertResult[0].id;
      }
    }

    const visitedSet = new Set<string>();
    if (body.visitedCountryCodes) {
      body.visitedCountryCodes.forEach((code: string) => visitedSet.add(code.toUpperCase()));
    }
    if (body.countryImages) {
      body.countryImages.forEach((ci: any) => {
        if (ci.countryCode) visitedSet.add(ci.countryCode.toUpperCase());
      });
    }
    if (body.collectionImages) {
      body.collectionImages.forEach((ci: any) => {
        if (ci.countryCodes) {
          ci.countryCodes.forEach((code: string) => visitedSet.add(code.toUpperCase()));
        }
      });
    }

    const unifiedVisitedCountryCodes = Array.from(visitedSet);
    const calculatedCountries = unifiedVisitedCountryCodes.length;
    
    const galleryCount = body.images?.gallery?.length || 0;
    const countryMediaCount = (body.countryImages || []).reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0);
    const collectionMediaCount = (body.collectionImages || []).reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0);
    const calculatedMedia = galleryCount + countryMediaCount + collectionMediaCount;

    const calculatedCollections = body.collectionImages?.length || 0;

    const newProfileData = {
      id: newId,
      user_id: userId,
      email: email || null,
      is_explorer_card: body.isExplorerCard ?? false,
      is_featured_profile: body.isFeaturedProfile ?? true,
      name,
      handle: handleWithAt,
      country: body.country || "",
      flag: body.flag || "",
      flag_code: body.flagCode || "",
      homeland_flag_code: body.homelandFlagCode || "",
      currently_in_flag_code: body.currentlyInFlagCode || "",
      countries: calculatedCountries,
      media: calculatedMedia,
      collections: calculatedCollections,
      align: body.align === "start" ? "start" : "end",
      bio: body.bio || "",
      interests: body.interests || [],
      languages: body.languages || [],
      homeland: body.homeland || "",
      currently_in: body.currentlyIn || "",
      socials: {
        instagram: body.socials?.instagram || "",
        x: body.socials?.x || "",
        linkedin: body.socials?.linkedin || "",
        youtube: body.socials?.youtube || "",
      },
      images: {
        cover: body.images?.cover || "",
        avatar: body.images?.avatar || "",
        gallery: body.images?.gallery || [],
      },
      about_images: body.aboutImages || [],
      visited_country_codes: unifiedVisitedCountryCodes,
      country_images: Array.isArray(body.countryImages)
        ? body.countryImages.map((ci: any) => ({
            countryCode: ci.countryCode || "",
            images: Array.isArray(ci.images) ? ci.images : [],
            coverPhoto: ci.coverPhoto || undefined,
            about: ci.about || "",
          }))
        : [],
      collection_images: Array.isArray(body.collectionImages)
        ? body.collectionImages.map((ci: any) => ({
            title: ci.title || "",
            images: Array.isArray(ci.images) ? ci.images : [],
            coverPhoto: ci.coverPhoto || undefined,
            about: ci.about || "",
            countryCodes: Array.isArray(ci.countryCodes)
              ? ci.countryCodes.map((code: unknown) => String(code).toUpperCase())
              : [],
          }))
        : [],
    };

    const inserted = await db.insert(featuredProfiles).values(newProfileData).returning();

    return NextResponse.json(normalizeProfile(inserted[0]), { status: 201 });
  } catch (err) {
    console.error("Failed to create profile:", err);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
