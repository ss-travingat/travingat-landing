"use client";

import LandingHeader from "@landing/components/LandingHeader";
import LandingFooter from "@landing/components/LandingFooter";
import { usePathname } from "next/navigation";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideShell = pathname?.startsWith("/profiles/") ?? false;

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      {!hideShell ? <LandingHeader /> : null}
      {!hideShell ? <div className="h-23 xl:h-33" aria-hidden="true" /> : null}
      <div key={pathname} className="animate-page-in">
        {children}
      </div>
      {!hideShell ? <LandingFooter /> : null}
    </div>
  );
}
