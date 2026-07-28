import profilesData from "./profiles.json";

export type SampleProfile = {
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
    cover: string | { url: string; width?: number; height?: number };
    avatar: string | { url: string; width?: number; height?: number };
    gallery: Array<string | { url: string; width?: number; height?: number }>;
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
  aboutImages?: string[];
  visitedCountryCodes: string[];
  countryImages?: { countryCode: string; images: Array<string | { url: string; width?: number; height?: number }>; about?: string }[];
  collectionImages?: { title: string; images: Array<string | { url: string; width?: number; height?: number }>; about?: string }[];
};

export const sampleProfiles = profilesData as unknown as SampleProfile[];

export function getSampleProfileById(id: string) {
  return sampleProfiles.find((profile) => profile.id === id);
}
