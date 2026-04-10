import profilesData from "@/profiles/profiles.json";

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
  countryImages?: { countryCode: string; imageUrl: string }[];
  collectionImages?: { title: string; imageUrl: string }[];
};

export const sampleProfiles = profilesData as unknown as SampleProfile[];

export function getSampleProfileById(id: string) {
  return sampleProfiles.find((profile) => profile.id === id);
}
