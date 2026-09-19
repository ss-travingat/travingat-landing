import { redirect, notFound } from "next/navigation";
import { CountryDetailComponent } from "@/features/profilepages";
import { getAllActiveProfiles, getProfileByHandle } from "@/lib/profiles";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const profiles = await getAllActiveProfiles();
    const params: { id: string; code: string }[] = [];
    for (const profile of profiles) {
      if (profile?.countryImages) {
        for (const ci of profile.countryImages) {
          if (ci.countryCode) {
            params.push({ id: profile.handle.replace(/^@/, ""), code: ci.countryCode.toUpperCase() });
          }
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
  const decodedId = decodeURIComponent(id);
  
  const profile = await getProfileByHandle(decodedId);

  if (!profile) {
    redirect("https://travingat.com/");
  }

  const countryEntry = profile.countryImages?.find(
    (ci: any) => ci.countryCode?.toUpperCase() === code.toUpperCase()
  );

  const isKnownFallbackCountry =
    profile.visitedCountryCodes?.map((c: string) => c.toUpperCase()).includes(code.toUpperCase()) ||
    profile.flagCode?.toUpperCase() === code.toUpperCase() ||
    profile.homelandFlagCode?.toUpperCase() === code.toUpperCase() ||
    profile.currentlyInFlagCode?.toUpperCase() === code.toUpperCase();

  const images = countryEntry
    ? countryEntry.images
    : isKnownFallbackCountry
    ? profile.images.gallery
    : null;

  if (!images) {
    redirect(`/${decodedId}`);
  }

  return (
    <CountryDetailComponent
      profile={profile as any}
      countryCode={code.toUpperCase()}
      images={images!}
    />
  );
}
