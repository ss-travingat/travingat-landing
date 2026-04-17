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
  countryImages?: { countryCode: string; images: string[] }[];
  collectionImages?: { title: string; images: string[] }[];
}

async function readProfiles(): Promise<Profile[]> {
  return readJsonFromR2<Profile[]>(R2_KEY);
}

async function writeProfiles(profiles: Profile[]): Promise<void> {
  await writeJsonToR2(R2_KEY, profiles);
}

function normalizeProfile(profile: Profile): Profile {
  return {
    ...profile,
    images: {
      cover: toLandingAssetUrl(profile.images.cover),
      avatar: toLandingAssetUrl(profile.images.avatar),
      gallery: profile.images.gallery.map(toLandingAssetUrl),
    },
    aboutImages: (profile.aboutImages ?? []).map(toLandingAssetUrl),
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

    const profiles = await readProfiles();
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
      countries: Number(body.countries) || 0,
      media: Number(body.media) || 0,
      collections: Number(body.collections) || 0,
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
      countryImages: body.countryImages || [],
      collectionImages: body.collectionImages || [],
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
