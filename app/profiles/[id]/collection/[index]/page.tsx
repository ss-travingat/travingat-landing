import { notFound } from "next/navigation";

import CollectionDetailComponent from "@/profiles/CollectionDetailComponent";
import { getSampleProfileById, sampleProfiles } from "@/profiles/profile-data";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { id: string; index: string }[] = [];
  for (const profile of sampleProfiles) {
    if (profile.collectionImages) {
      profile.collectionImages.forEach((_, i) => {
        params.push({ id: profile.id, index: String(i) });
      });
    }
  }
  return params;
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string; index: string }>;
}) {
  const { id, index } = await params;
  const profile = getSampleProfileById(id);

  if (!profile) {
    notFound();
  }

  const idx = parseInt(index, 10);
  const collectionEntry = profile.collectionImages?.[idx];

  if (!collectionEntry || collectionEntry.images.length === 0) {
    notFound();
  }

  return (
    <CollectionDetailComponent
      profile={profile}
      title={collectionEntry.title}
      images={collectionEntry.images}
    />
  );
}
