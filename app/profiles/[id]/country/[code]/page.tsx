import { notFound } from "next/navigation";

import CountryDetailComponent from "@/profiles/CountryDetailComponent";
import { getSampleProfileById, sampleProfiles } from "@/profiles/profile-data";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { id: string; code: string }[] = [];
  for (const profile of sampleProfiles) {
    if (profile.countryImages) {
      for (const ci of profile.countryImages) {
        params.push({ id: profile.id, code: ci.countryCode.toUpperCase() });
      }
    }
  }
  return params;
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ id: string; code: string }>;
}) {
  const { id, code } = await params;
  const profile = getSampleProfileById(id);

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
