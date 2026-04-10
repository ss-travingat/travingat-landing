import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { toLandingAssetUrl } from "@/lib/landing-assets";

const DATA_PATH = path.join(process.cwd(), "profiles/profiles.json");

interface CountryImage {
  countryCode: string;
  images: string[];
}

interface CollectionImage {
  title: string;
  images: string[];
}

interface ProfileImages {
  cover: string;
  avatar: string;
  gallery: string[];
}

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
  images: ProfileImages;
  align: "start" | "end";
  bio: string;
  interests: string[];
  languages: string[];
  homeland: string;
  currentlyIn: string;
  socials: {
    x?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  visitedCountryCodes: string[];
  countryImages?: CountryImage[];
  collectionImages?: CollectionImage[];
}

function readProfiles(): Profile[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeProfiles(data: Profile[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
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

// GET — return all profiles
export async function GET() {
  try {
    const profiles = readProfiles();
    return NextResponse.json(profiles.map(normalizeProfile));
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// POST — add a new profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, handle, country, flag, flagCode, homelandFlagCode, currentlyInFlagCode, countries, media, collections, images, align, bio, interests, languages, homeland, currentlyIn, socials, visitedCountryCodes } = body;

    if (!name || !handle) {
      return NextResponse.json(
        { error: "Name and handle are required" },
        { status: 400 }
      );
    }

    const profiles = readProfiles();
    const newId = String(
      Math.max(0, ...profiles.map((p) => Number(p.id))) + 1
    ).padStart(3, "0");

    const newProfile: Profile = {
      id: newId,
      name,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      country: country || "",
      flag: flag || "",
      flagCode: flagCode || "",
      homelandFlagCode: homelandFlagCode || "",
      currentlyInFlagCode: currentlyInFlagCode || "",
      countries: Number(countries) || 0,
      media: Number(media) || 0,
      collections: Number(collections) || 0,
      images: {
        cover: images?.cover || "",
        avatar: images?.avatar || "",
        gallery: images?.gallery || [],
      },
      align: align === "start" ? "start" : "end",
      bio: bio || "",
      interests: interests || [],
      languages: languages || [],
      homeland: homeland || "",
      currentlyIn: currentlyIn || "",
      socials: {
        instagram: socials?.instagram || "",
        x: socials?.x || "",
        linkedin: socials?.linkedin || "",
        youtube: socials?.youtube || "",
      },
      visitedCountryCodes: visitedCountryCodes || [],
      countryImages: body.countryImages || [],
      collectionImages: body.collectionImages || [],
    };

    profiles.push(newProfile);
    writeProfiles(profiles);

    return NextResponse.json(normalizeProfile(newProfile), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
