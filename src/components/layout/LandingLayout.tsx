"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import { ProfileFooter } from "@/features/profilepages";

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
      <div className="travingat-loader">
        {/* Dotted orbit ring */}
        <svg
          className="travingat-loader__ring"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#2a2a2a"
            strokeWidth="2"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Plane orbiting the ring */}
        <div className="travingat-loader__orbit" aria-hidden="true">
          <div className="travingat-loader__plane-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              className="travingat-loader__plane-icon"
            >
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
        </div>

        {/* Brand wordmark */}
        <p className="travingat-loader__label">travingat</p>
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
  const isProfileRoute = Boolean(pathname?.startsWith("/profiles/"));
  const isAdminLoginRoute = pathname === "/admin/login";
  const hideNavbar = false;
  // Show loader on first mount, hide after hydration + minimum display time
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-clip">
      <PageLoader visible={loading} />
      {hideNavbar ? null : <LandingHeader />}
      {hideNavbar ? null : <div className={`h-23 xl:h-33 ${isProfileRoute ? "max-[810px]:hidden" : ""}`} aria-hidden="true" />}
      <div className="animate-page-in">
        {children}
      </div>
      {!isAdminLoginRoute && (isProfileRoute ? <ProfileFooter /> : <LandingFooter />)}
    </div>
  );
}
