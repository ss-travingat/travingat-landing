import { notFound } from "next/navigation";

import ProfileComponent from "@/profiles/ProfileComponent";
import { getSampleProfileById, sampleProfiles } from "@/profiles/profile-data";

export function generateStaticParams() {
  return sampleProfiles.map((profile) => ({ id: profile.id }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getSampleProfileById(id);

  if (!profile) {
    notFound();
  }

  return <ProfileComponent profile={profile} />;
}
