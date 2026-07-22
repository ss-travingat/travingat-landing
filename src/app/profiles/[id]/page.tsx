import { notFound } from "next/navigation";

import { ProfileComponent } from "@/features/profilepages";
import { readJsonFromR2 } from "@/lib/r2-upload";
import type { SampleProfile } from "@/features/profilepages";

const R2_KEY = "landingpage-assets/data/profiles.json";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const profiles = await readJsonFromR2<SampleProfile[]>(R2_KEY);
    return profiles.map((profile) => ({ id: profile.handle.replace(/^@/, "") }));
  } catch {
    return [];
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let profiles: SampleProfile[];
  try {
    profiles = await readJsonFromR2<SampleProfile[]>(R2_KEY);
  } catch {
    notFound();
  }

  const decodedId = decodeURIComponent(id);
  const profile = profiles.find((p) => p.handle.replace(/^@/, "") === decodedId);

  if (!profile) {
    notFound();
  }

  return <ProfileComponent profile={profile} />;
}
