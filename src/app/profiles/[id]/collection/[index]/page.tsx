import { redirect, notFound } from "next/navigation";
import { CollectionDetailComponent } from "@/features/profilepages";
import { getAllActiveProfiles, getProfileByHandle } from "@/lib/profiles";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const profiles = await getAllActiveProfiles();
    const params: { id: string; index: string }[] = [];
    for (const profile of profiles) {
      if (profile?.collectionImages) {
        profile.collectionImages.forEach((_: any, i: number) => {
          params.push({ id: profile.handle.replace(/^@/, ""), index: String(i) });
        });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string; index: string }>;
}) {
  const { id, index } = await params;
  const decodedId = decodeURIComponent(id);
  
  const profile = await getProfileByHandle(decodedId);

  if (!profile) {
    redirect("https://travingat.com/");
  }

  const idx = parseInt(index, 10);
  const collectionEntry = profile.collectionImages?.[idx];

  if (!collectionEntry) {
    redirect(`/${decodedId}`);
  }

  return (
    <CollectionDetailComponent
      profile={profile as any}
      title={collectionEntry.title}
      images={collectionEntry.images}
      collectionCountryCodes={collectionEntry.countryCodes ?? []}
    />
  );
}
