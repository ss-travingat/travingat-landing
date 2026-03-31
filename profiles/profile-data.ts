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
  cover: string;
  avatar: string;
  align: "start" | "end";
  bio: string;
  interests: string[];
  languages: string[];
  homeland: string;
  currentlyIn: string;
  socials: string[];
  photoUrls: string[];
};

export const sampleProfiles = profilesData as SampleProfile[];

export function getSampleProfileById(id: string) {
  return sampleProfiles.find((profile) => profile.id === id);
}
