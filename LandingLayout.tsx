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
      {children}
      {!hideShell ? <LandingFooter /> : null}
    </div>
  );
}
