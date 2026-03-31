import { sampleProfiles } from "@/profiles/profile-data";

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
  cover: string;
  avatar: string;
  align: "start" | "end";
  bio: string;
  interests: string[];
  languages: string[];
  homeland: string;
  currentlyIn: string;
  socials: string[];
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
  cover: profile.cover,
  avatar: profile.avatar,
  align: profile.align,
  bio: profile.bio,
  interests: profile.interests,
  languages: profile.languages,
  homeland: profile.homeland,
  currentlyIn: profile.currentlyIn,
  socials: profile.socials,
}));
