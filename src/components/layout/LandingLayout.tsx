"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import TravingatBadge from "@/components/ui/TravingatBadge";

// ── Plane-orbit loader overlay ────────────────────────────────────────────────
function PageLoader({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        transition: "opacity 400ms ease, visibility 400ms ease",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "all" : "none",
      }}
      aria-hidden={!visible}
    >
      <div className="w-[205px] h-[205px]">
        <TravingatBadge />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const nonProfileRoots = ["/api", "/admin", "/blog", "/pricing", "/templates", "/_next", "/static", "/explorercard", "/login", "/join", "/edit"];
  const isProfileRoute = Boolean(
    pathname && 
    pathname !== "/" && 
    pathname !== "/favicon.ico" && 
    !nonProfileRoots.some(root => pathname.startsWith(root))
  );
  const isExplorerCardRoute = Boolean(pathname?.includes("/explorercard"));
  const isAdminRoute = pathname?.startsWith("/admin");
  const hideNavbar = pathname?.startsWith("/edit/explorercard") || pathname === "/explorercard" || pathname === "/join/explorercard" || isAdminRoute;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-clip">
      <PageLoader visible={loading} />
      <Suspense fallback={null}>
        {hideNavbar ? null : <LandingHeader className={isProfileRoute ? "hidden min-[1200px]:block" : ""} />}
      </Suspense>
      {hideNavbar ? null : <div className={`h-[92px] lg:h-[124px] ${isProfileRoute ? "hidden min-[1200px]:block" : ""}`} aria-hidden="true" />}
      <div className="animate-page-in">
        {children}
      </div>
      {!isAdminRoute && !isProfileRoute && !isExplorerCardRoute && <LandingFooter />}
    </div>
  );
}
