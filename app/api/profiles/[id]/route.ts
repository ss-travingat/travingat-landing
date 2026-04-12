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
    const profiles = await readProfiles();
    const index = profiles.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    profiles[index] = {
      ...profiles[index],
      name: body.name ?? profiles[index].name,
      handle: body.handle ?? profiles[index].handle,
      country: body.country ?? profiles[index].country,
      flag: body.flag ?? profiles[index].flag,
      flagCode: body.flagCode ?? profiles[index].flagCode,
      homelandFlagCode: body.homelandFlagCode ?? profiles[index].homelandFlagCode,
      currentlyInFlagCode: body.currentlyInFlagCode ?? profiles[index].currentlyInFlagCode,
      countries: body.countries !== undefined ? Number(body.countries) : profiles[index].countries,
      media: body.media !== undefined ? Number(body.media) : profiles[index].media,
      collections: body.collections !== undefined ? Number(body.collections) : profiles[index].collections,
      images: {
        cover: body.images?.cover ?? profiles[index].images.cover,
        avatar: body.images?.avatar ?? profiles[index].images.avatar,
        gallery: body.images?.gallery ?? profiles[index].images.gallery,
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
      visitedCountryCodes: body.visitedCountryCodes ?? profiles[index].visitedCountryCodes,
      countryImages: body.countryImages ?? profiles[index].countryImages ?? [],
      collectionImages: body.collectionImages ?? profiles[index].collectionImages ?? [],
    };

    await writeProfiles(profiles);
    return NextResponse.json(normalizeProfile(profiles[index]));
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
    const profiles = await readProfiles();
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
