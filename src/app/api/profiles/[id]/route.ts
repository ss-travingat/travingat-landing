import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { readJsonFromR2, writeJsonToR2 } from "@/lib/r2-upload";

const R2_KEY = "landingpage-assets/data/profiles.json";

interface Profile {
  id: string;
  name: string;
  handle: string;
  country: string;
  flag: string;
  flagCode: string;
  homelandFlagCode?: string;
  currentlyInFlagCode?: string;
  countries: number;
  media: number;
  collections: number;
  images: { cover: string; avatar: string; gallery: string[] };
  align: "start" | "end";
  bio: string;
  interests: string[];
  languages: string[];
  homeland: string;
  currentlyIn: string;
  socials: { x?: string; instagram?: string; linkedin?: string; youtube?: string };
  aboutImages?: string[];
  visitedCountryCodes: string[];
  countryImages?: { countryCode: string; images: string[]; coverPhoto?: string; about?: string }[];
  collectionImages?: { title: string; images: string[]; coverPhoto?: string; about?: string; countryCodes?: string[] }[];
}

async function readProfiles(): Promise<Profile[]> {
  return readJsonFromR2<Profile[]>(R2_KEY);
}

async function writeProfiles(profiles: Profile[]): Promise<void> {
  await writeJsonToR2(R2_KEY, profiles);
}

function normalizeProfile(profile: Profile): Profile {
  const visitedSet = new Set<string>();
  if (profile.visitedCountryCodes) {
    profile.visitedCountryCodes.forEach((code) => visitedSet.add(code.toUpperCase()));
  }
  if (profile.countryImages) {
    profile.countryImages.forEach((ci) => {
      if (ci.countryCode) visitedSet.add(ci.countryCode.toUpperCase());
    });
  }
  if (profile.collectionImages) {
    profile.collectionImages.forEach((ci) => {
      if (ci.countryCodes) {
        ci.countryCodes.forEach((code) => visitedSet.add(code.toUpperCase()));
      }
    });
  }
  
  const unifiedVisitedCountryCodes = Array.from(visitedSet);
  const calculatedCountries = unifiedVisitedCountryCodes.length;
  const galleryCount = profile.images?.gallery?.length || 0;
  const countryMediaCount = (profile.countryImages || []).reduce((sum, c) => sum + (c.images?.length || 0), 0);
  const collectionMediaCount = (profile.collectionImages || []).reduce((sum, c) => sum + (c.images?.length || 0), 0);
  const calculatedMedia = galleryCount + countryMediaCount + collectionMediaCount;

  const calculatedCollections = profile.collectionImages?.length || 0;

  function resolveImageAsset(img: any) {
    return typeof img === "string" ? img : img?.url ?? "";
  }

  return {
    ...profile,
    countries: calculatedCountries,
    collections: calculatedCollections,
    media: calculatedMedia,
    images: {
      cover: toLandingAssetUrl(resolveImageAsset(profile.images.cover)),
      avatar: toLandingAssetUrl(resolveImageAsset(profile.images.avatar)),
      gallery: profile.images.gallery.map((g) => toLandingAssetUrl(resolveImageAsset(g))),
    },
    visitedCountryCodes: unifiedVisitedCountryCodes,
    aboutImages: (profile.aboutImages ?? []).map(resolveImageAsset).map(toLandingAssetUrl),
  };
}

// GET — return a single profile
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profiles = await readProfiles();
    const profile = profiles.find((p) => p.id === id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(normalizeProfile(profile));
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PUT — update a profile
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    let profiles: Profile[] = [];
    try {
      profiles = await readProfiles();
    } catch {
      // Profiles might not exist yet
    }
    const index = profiles.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const updatedVisitedCountryCodes = body.visitedCountryCodes ?? profiles[index].visitedCountryCodes;
    const updatedCountryImages = Array.isArray(body.countryImages)
      ? body.countryImages.map((ci: any) => ({
          countryCode: ci.countryCode || "",
          images: Array.isArray(ci.images) ? ci.images : [],
          coverPhoto: ci.coverPhoto || undefined,
          about: ci.about || "",
        }))
      : profiles[index].countryImages;
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
      : profiles[index].collectionImages;
    const updatedGallery = body.images?.gallery ?? profiles[index].images.gallery;

    profiles[index] = normalizeProfile({
      ...profiles[index],
      name: body.name ?? profiles[index].name,
      handle: body.handle ?? profiles[index].handle,
      country: body.country ?? profiles[index].country,
      flag: body.flag ?? profiles[index].flag,
      flagCode: body.flagCode ?? profiles[index].flagCode,
      homelandFlagCode: body.homelandFlagCode ?? profiles[index].homelandFlagCode,
      currentlyInFlagCode: body.currentlyInFlagCode ?? profiles[index].currentlyInFlagCode,
      countries: (updatedVisitedCountryCodes || []).length, // This will be overwritten by normalizeProfile
      media: (updatedGallery || []).length +
             (updatedCountryImages || []).reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0) +
             (updatedCollectionImages || []).reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0),
      collections: (updatedCollectionImages || []).length,
      images: {
        cover: body.images?.cover ?? profiles[index].images.cover,
        avatar: body.images?.avatar ?? profiles[index].images.avatar,
        gallery: updatedGallery,
      },
      align: body.align ?? profiles[index].align,
      bio: body.bio ?? profiles[index].bio,
      interests: body.interests ?? profiles[index].interests,
      languages: body.languages ?? profiles[index].languages,
      homeland: body.homeland ?? profiles[index].homeland,
      currentlyIn: body.currentlyIn ?? profiles[index].currentlyIn,
      socials: {
        instagram: body.socials?.instagram ?? profiles[index].socials?.instagram,
        x: body.socials?.x ?? profiles[index].socials?.x,
        linkedin: body.socials?.linkedin ?? profiles[index].socials?.linkedin,
        youtube: body.socials?.youtube ?? profiles[index].socials?.youtube,
      },
      aboutImages: body.aboutImages ?? profiles[index].aboutImages,
      visitedCountryCodes: updatedVisitedCountryCodes,
      countryImages: updatedCountryImages,
      collectionImages: updatedCollectionImages,
    });

    await writeProfiles(profiles);

    // Invalidate Next.js cache so profile and country/collection pages
    // immediately reflect the updated data.
    const handle = profiles[index].handle.replace(/^@/, "");
    revalidatePath(`/profiles/${handle}`, "layout");
    revalidatePath("/featured-profiles");
    revalidatePath("/");

    return NextResponse.json(profiles[index]);
  } catch (err) {
    console.error("Failed to update profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

// DELETE — remove a profile
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let profiles: Profile[] = [];
    try {
      profiles = await readProfiles();
    } catch {
      // Profiles might not exist yet
    }
    const filtered = profiles.filter((p) => p.id !== id);

    if (filtered.length === profiles.length) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await writeProfiles(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
