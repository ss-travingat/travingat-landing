import { sampleProfiles } from "@/components/features/profiles/profile-data";

export type DemoProfile = {
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
  images: {
    cover: string;
    avatar: string;
    gallery: string[];
  };
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
};

export const demoProfiles: DemoProfile[] = sampleProfiles.map((profile) => ({
  id: profile.id,
  name: profile.name,
  handle: profile.handle,
  country: profile.country,
  flag: profile.flag,
  flagCode: profile.flagCode,
  homelandFlagCode: profile.homelandFlagCode,
  currentlyInFlagCode: profile.currentlyInFlagCode,
  countries: profile.countries,
  media: profile.media,
  collections: profile.collections,
  images: profile.images,
  align: profile.align,
  bio: profile.bio,
  interests: profile.interests,
  languages: profile.languages,
  homeland: profile.homeland,
  currentlyIn: profile.currentlyIn,
  socials: profile.socials,
  visitedCountryCodes: profile.visitedCountryCodes ?? [],
}));
