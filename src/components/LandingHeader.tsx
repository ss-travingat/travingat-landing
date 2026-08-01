"use client";

import { type MouseEvent, useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import LoadedImage from "@/components/ui/LoadedImage";


function LandingHeaderContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent | globalThis.TouchEvent) {
      const target = event.target as Node;
      if (
        menuOpen &&
        headerRef.current &&
        !headerRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);
  const onboardingUrl = "https://app.travingat.com/";
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasImage = searchParams?.has("image");
  const isProfileRoute = Boolean(pathname?.startsWith("/profiles/"));

  const containerClasses = "mx-auto w-full max-w-[1728px] px-[12px] min-[810px]:px-[32px] min-[1200px]:px-[48px] min-[1440px]:px-[64px]";

  const mobileNavContainerClasses = isProfileRoute
    ? "mx-auto w-full max-w-[1728px] px-[12px] min-[810px]:px-[32px]"
    : "mx-auto w-full max-w-432 px-5 md:px-8";

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      if (menuOpen) return;
      const current = window.scrollY;
      // Show when scrolling up, hide when scrolling down (past 80px to avoid jitter at top)
      if (current < 80 || current < lastScrollY.current) {
        setVisible(true);
      } else if (current > lastScrollY.current) {
        setVisible(false);
      }
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) {
      window.location.href = `/#${sectionId}`;
      return;
    }

    setMenuOpen(false);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (hasImage) return null;

  return (
    <>
      <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"} ${isProfileRoute ? "max-[810px]:hidden" : ""}`}>
      <div className={containerClasses}>
        <div className="h-[92px] lg:h-[124px] flex items-center justify-between relative">
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center">
              <LoadedImage
                src="/icons/travingat-logo.svg?v=newlogo"
                alt="Travingat Logo"
                className="h-[24px] lg:h-[28px] w-auto"
                priority
              />
            </Link>
          </div>

          <div className="hidden min-[811px]:flex flex-none items-center justify-center">
            <nav className="flex items-center gap-1 rounded-[999px] bg-gradient-to-b from-[rgba(46,46,46,0.8)] to-[#171717] p-1 backdrop-blur-[5px] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.25)] border-t border-[rgba(161,161,161,0.1)]">
              <Link
                href="/"
                className={`rounded-[999px] px-5 py-2.5 text-[16px] font-normal leading-[19.2px] transition ${pathname === "/" ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white"}`}
              >
                Home
              </Link>
              <Link
                href="/newprofiles"
                className={`rounded-[999px] px-5 py-2.5 text-[16px] font-normal leading-[19.2px] transition ${pathname === "/newprofiles" || pathname?.startsWith("/profiles") ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white"}`}
              >
                Profiles
              </Link>
              <Link
                href="/templates"
                className={`rounded-[999px] px-5 py-2.5 text-[16px] font-normal leading-[19.2px] transition ${pathname === "/templates" || pathname?.startsWith("/templates") ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white"}`}
              >
                Templates
              </Link>
              <Link
                href="/pricing"
                className={`rounded-[999px] px-5 py-2.5 text-[16px] font-normal leading-[19.2px] transition ${pathname === "/pricing" ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white"}`}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className={`rounded-[999px] px-5 py-2.5 text-[16px] font-normal leading-[19.2px] transition ${pathname === "/blog" || pathname?.startsWith("/blog") ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white"}`}
              >
                Blog
              </Link>
            </nav>
          </div>

          <div className="flex-1 flex items-center justify-end gap-2">
            <div className="hidden min-[811px]:flex items-center">
              <a
                href="#join"
                onClick={(event) => scrollToSection(event, "join")}
                className="inline-flex items-center justify-center rounded-[999px] bg-white px-[32px] py-[12px] text-[14px] font-medium leading-[1.2] tracking-tight text-black hover:bg-[#ececec] transition"
              >
                Join now
              </a>
            </div>

            <div className="flex min-[811px]:hidden items-center gap-2">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`relative flex h-[36px] w-[36px] items-center justify-center rounded-full transition-colors ${menuOpen ? 'bg-[#1c1c1c] text-white hover:bg-[#2a2a2a]' : 'text-white'}`}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7V5H21V7H3ZM3 19V17H21V19H3ZM3 13V11H21V13H3Z" fill="white" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* Fixed Full-Screen Mobile Overlay Menu */}
      <div 
        ref={menuRef}
        className={`fixed inset-0 z-[90] min-[811px]:hidden bg-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-center items-center px-6 pt-[90px] pb-10 ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="w-full max-w-xs flex flex-col items-center gap-[24px]">
          <nav className="flex flex-col items-center justify-center gap-[24px] w-full">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Home</Link>
            <Link href="/newprofiles" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Profiles</Link>
            <Link href="/templates" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Templates</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Pricing</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Blog</Link>
            
            <a
              href="#join"
              onClick={(event) => scrollToSection(event, "join")}
              className="mt-[12px] w-full text-center rounded-[999px] bg-white px-[28px] py-[12px] text-[15px] font-medium tracking-tight text-black hover:bg-[#ececec] transition shadow-lg"
            >
              Join now
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}

export default function LandingHeader() {
  return (
    <Suspense fallback={null}>
      <LandingHeaderContent />
    </Suspense>
  );
}
