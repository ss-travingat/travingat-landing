import { notFound } from "next/navigation";
import { ProfileComponent } from "@/features/profilepages";
import { getAllActiveProfiles, getProfileByHandle } from "@/lib/profiles";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const profiles = await getAllActiveProfiles();
    return profiles.map((profile: any) => ({ id: profile.handle.replace(/^@/, "") }));
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
  const decodedId = decodeURIComponent(id);
  
  const profile = await getProfileByHandle(decodedId);

  if (!profile) {
    notFound();
  }

  return <ProfileComponent profile={profile} />;
}
