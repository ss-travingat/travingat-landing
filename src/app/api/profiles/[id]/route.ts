import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { getDrizzle } from "@/lib/drizzle";
import { featuredProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveImageAsset(img: any) {
  return typeof img === "string" ? img : img?.url ?? "";
}

function normalizeProfile(p: any) {
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDrizzle();
    
    const profileRecords = await db
      .select()
      .from(featuredProfiles)
      .where(eq(featuredProfiles.id, id))
      .limit(1);

    if (profileRecords.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeProfile(profileRecords[0]));
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const db = getDrizzle();
    const existingProfiles = await db
      .select()
      .from(featuredProfiles)
      .where(eq(featuredProfiles.id, id))
      .limit(1);

    if (existingProfiles.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const current = existingProfiles[0];

    const updatedVisitedCountryCodes = body.visitedCountryCodes ?? current.visited_country_codes;
    const updatedCountryImages = Array.isArray(body.countryImages)
      ? body.countryImages.map((ci: any) => ({
          countryCode: ci.countryCode || "",
          images: Array.isArray(ci.images) ? ci.images : [],
          coverPhoto: ci.coverPhoto || undefined,
          about: ci.about || "",
        }))
      : current.country_images;
    const updatedCollectionImages = Array.isArray(body.collectionImages)
      ? body.collectionImages.map((ci: any) => ({
          title: ci.title || "",
          images: Array.isArray(ci.images) ? ci.images : [],
          coverPhoto: ci.coverPhoto || undefined,
          about: ci.about || "",
          countryCodes: Array.isArray(ci.countryCodes)
            ? ci.countryCodes.map((code: unknown) => String(code).toUpperCase())
            : [],
        }))
      : current.collection_images;
    
    const oldImages = current.images as { cover: string; avatar: string; gallery: string[] };
    const updatedGallery = body.images?.gallery ?? oldImages?.gallery ?? [];

    const computedMedia = (updatedGallery || []).length +
             (updatedCountryImages || []).reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0) +
             (updatedCollectionImages || []).reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0);

    let userId = current.user_id;

    if (body.email && body.email !== current.email) {
      const existingUser = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
      
      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        const nameToUse = body.name || current.name;
        const userInsertResult = await db.insert(users).values({
          email: body.email,
          first_name: nameToUse.split(" ")[0],
          last_name: nameToUse.split(" ").slice(1).join(" ") || undefined,
          country: body.country || current.country || undefined,
          avatar_url: body.images?.avatar || oldImages?.avatar || undefined,
          cover_photo_url: body.images?.cover || oldImages?.cover || undefined,
        }).returning({ id: users.id });
        userId = userInsertResult[0].id;
      }
    }

    const updatePayload = {
      user_id: userId,
      email: body.email !== undefined ? body.email : current.email,
      is_explorer_card: body.isExplorerCard !== undefined ? body.isExplorerCard : current.is_explorer_card,
      is_featured_profile: body.isFeaturedProfile !== undefined ? body.isFeaturedProfile : current.is_featured_profile,
      name: body.name ?? current.name,
      handle: body.handle ?? current.handle,
      country: body.country ?? current.country,
      flag: body.flag ?? current.flag,
      flag_code: body.flagCode ?? current.flag_code,
      homeland_flag_code: body.homelandFlagCode ?? current.homeland_flag_code,
      currently_in_flag_code: body.currentlyInFlagCode ?? current.currently_in_flag_code,
      countries: (updatedVisitedCountryCodes || []).length,
      media: computedMedia,
      collections: (updatedCollectionImages || []).length,
      images: {
        cover: body.images?.cover ?? oldImages?.cover ?? "",
        avatar: body.images?.avatar ?? oldImages?.avatar ?? "",
        gallery: updatedGallery,
      },
      align: body.align ?? current.align,
      bio: body.bio ?? current.bio,
      interests: body.interests ?? current.interests,
      languages: body.languages ?? current.languages,
      homeland: body.homeland ?? current.homeland,
      currently_in: body.currentlyIn ?? current.currently_in,
      socials: {
        instagram: body.socials?.instagram ?? (current.socials as any)?.instagram ?? "",
        x: body.socials?.x ?? (current.socials as any)?.x ?? "",
        linkedin: body.socials?.linkedin ?? (current.socials as any)?.linkedin ?? "",
        youtube: body.socials?.youtube ?? (current.socials as any)?.youtube ?? "",
      },
      about_images: body.aboutImages ?? current.about_images,
      visited_country_codes: updatedVisitedCountryCodes,
      country_images: updatedCountryImages,
      collection_images: updatedCollectionImages,
      updated_at: new Date(),
    };

    const updated = await db
      .update(featuredProfiles)
      .set(updatePayload)
      .where(eq(featuredProfiles.id, id))
      .returning();

    const handle = updated[0].handle.replace(/^@/, "");
    revalidatePath(`/profiles/${handle}`, "layout");
    revalidatePath("/featured-profiles");
    revalidatePath("/");

    return NextResponse.json(normalizeProfile(updated[0]));
  } catch (err) {
    console.error("Failed to update profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDrizzle();
    
    const existingProfiles = await db
      .select()
      .from(featuredProfiles)
      .where(eq(featuredProfiles.id, id))
      .limit(1);

    if (existingProfiles.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await db
      .update(featuredProfiles)
      .set({ deleted_at: new Date() })
      .where(eq(featuredProfiles.id, id));
    
    const handle = existingProfiles[0].handle.replace(/^@/, "");
    revalidatePath(`/profiles/${handle}`, "layout");
    revalidatePath("/featured-profiles");
    revalidatePath("/");
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
