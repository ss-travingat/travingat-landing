"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch("/api/cms/session", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.authenticated) {
          router.replace("/admin/login");
          return;
        }
      } catch {
        router.replace("/admin/login");
        return;
      } finally {
        setChecking(false);
      }
    };

    setChecking(true);
    verifySession();
  }, [pathname, router]);

  if (pathname !== "/admin/login" && checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white grid place-items-center">
        <p className="text-sm text-white/60">Verifying admin session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
