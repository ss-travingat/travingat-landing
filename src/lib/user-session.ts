import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        Cookie: `access_token=${token}`
      },
      next: { revalidate: 0 }
    });
    
    if (res.ok) {
      const data = await res.json();
      return {
        ...data.user,
        id: data.user.id,
        explorerCardId: data.explorerCard
      };
    }
  } catch (error) {
    console.error("Error fetching session user:", error);
  }
  return null;
}
