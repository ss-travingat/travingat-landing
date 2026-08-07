import { NextResponse } from "next/server";
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
  const calculatedCollections = profile.collectionImages?.length || 0;
  const galleryCount = profile.images?.gallery?.length || 0;
  const countryMediaCount = (profile.countryImages || []).reduce((sum, c) => sum + (c.images?.length || 0), 0);
  const collectionMediaCount = (profile.collectionImages || []).reduce((sum, c) => sum + (c.images?.length || 0), 0);
  const calculatedMedia = galleryCount + countryMediaCount + collectionMediaCount;

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

// GET — return all profiles
export async function GET() {
  try {
    const profiles = await readProfiles();
    return NextResponse.json(profiles.map(normalizeProfile));
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// POST — add a new profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, handle } = body;

    if (!name || !handle) {
      return NextResponse.json(
        { error: "Name and handle are required" },
        { status: 400 }
      );
    }

    let profiles: Profile[] = [];
    try {
      profiles = await readProfiles();
    } catch (readErr) {
      // Start with an empty array if profiles.json doesn't exist yet
    }
    const newId = String(
      Math.max(0, ...profiles.map((p) => Number(p.id))) + 1
    ).padStart(3, "0");

    const newProfile: Profile = {
      id: newId,
      name,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      country: body.country || "",
      flag: body.flag || "",
      flagCode: body.flagCode || "",
      homelandFlagCode: body.homelandFlagCode || "",
      currentlyInFlagCode: body.currentlyInFlagCode || "",
      countries: (body.visitedCountryCodes || []).length,
      media: 
        (body.images?.gallery || []).length +
        (Array.isArray(body.countryImages) ? body.countryImages.reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0) : 0) +
        (Array.isArray(body.collectionImages) ? body.collectionImages.reduce((sum: number, c: any) => sum + (c.images?.length || 0), 0) : 0),
      collections: (body.collectionImages || []).length,
      images: {
        cover: body.images?.cover || "",
        avatar: body.images?.avatar || "",
        gallery: body.images?.gallery || [],
      },
      align: body.align === "start" ? "start" : "end",
      bio: body.bio || "",
      interests: body.interests || [],
      languages: body.languages || [],
      homeland: body.homeland || "",
      currentlyIn: body.currentlyIn || "",
      socials: {
        instagram: body.socials?.instagram || "",
        x: body.socials?.x || "",
        linkedin: body.socials?.linkedin || "",
        youtube: body.socials?.youtube || "",
      },
      aboutImages: body.aboutImages || [],
      visitedCountryCodes: body.visitedCountryCodes || [],
      countryImages: Array.isArray(body.countryImages)
        ? body.countryImages.map((ci: any) => ({
            countryCode: ci.countryCode || "",
            images: Array.isArray(ci.images) ? ci.images : [],
            coverPhoto: ci.coverPhoto || undefined,
            about: ci.about || "",
          }))
        : [],
      collectionImages: Array.isArray(body.collectionImages)
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

    profiles.push(newProfile);
    await writeProfiles(profiles);

    return NextResponse.json(normalizeProfile(newProfile), { status: 201 });
  } catch (err) {
    console.error("Failed to create profile:", err);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
