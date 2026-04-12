import { notFound } from "next/navigation";

import CollectionDetailComponent from "@/profiles/CollectionDetailComponent";
import { readJsonFromR2 } from "@/lib/r2-upload";
import type { SampleProfile } from "@/profiles/profile-data";

const R2_KEY = "landingpage-assets/data/profiles.json";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const profiles = await readJsonFromR2<SampleProfile[]>(R2_KEY);
    const params: { id: string; index: string }[] = [];
    for (const profile of profiles) {
      if (profile.collectionImages) {
        profile.collectionImages.forEach((_, i) => {
          params.push({ id: profile.id, index: String(i) });
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
