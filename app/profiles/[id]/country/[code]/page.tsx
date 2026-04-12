import { notFound } from "next/navigation";

import CountryDetailComponent from "@/profiles/CountryDetailComponent";
import { readJsonFromR2 } from "@/lib/r2-upload";
import type { SampleProfile } from "@/profiles/profile-data";

const R2_KEY = "landingpage-assets/data/profiles.json";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const profiles = await readJsonFromR2<SampleProfile[]>(R2_KEY);
    const params: { id: string; code: string }[] = [];
    for (const profile of profiles) {
      if (profile.countryImages) {
        for (const ci of profile.countryImages) {
          params.push({ id: profile.id, code: ci.countryCode.toUpperCase() });
        }
      }
    }
    return params;
  } catch {
    return [];
  }
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ id: string; code: string }>;
}) {
  const { id, code } = await params;

  let profiles: SampleProfile[];
  try {
    profiles = await readJsonFromR2<SampleProfile[]>(R2_KEY);
  } catch {
    notFound();
  }

  const profile = profiles.find((p) => p.id === id);

  if (!profile) {
    notFound();
  }

  const countryEntry = profile.countryImages?.find(
    (ci) => ci.countryCode.toUpperCase() === code.toUpperCase()
  );

  // Fallback: profile uses visitedCountryCodes / flagCode fields for countries tab
  // Allow viewing if this code appears in visitedCountryCodes or top-level flag codes
  const isKnownFallbackCountry =
    profile.visitedCountryCodes?.map((c) => c.toUpperCase()).includes(code.toUpperCase()) ||
    profile.flagCode?.toUpperCase() === code.toUpperCase() ||
    profile.homelandFlagCode?.toUpperCase() === code.toUpperCase() ||
    profile.currentlyInFlagCode?.toUpperCase() === code.toUpperCase();

  const images = countryEntry?.images.length
    ? countryEntry.images
    : isKnownFallbackCountry
    ? profile.images.gallery
    : null;

  if (!images || images.length === 0) {
    notFound();
  }

  return (
    <CountryDetailComponent
      profile={profile}
      countryCode={code.toUpperCase()}
      images={images!}
    />
  );
}
