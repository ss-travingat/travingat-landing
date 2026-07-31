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

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent | globalThis.TouchEvent) {
      if (menuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
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

  const containerClasses = isProfileRoute
    ? "mx-auto w-full max-w-[1728px] px-[12px] min-[810px]:px-[32px] min-[1200px]:px-[48px] min-[1440px]:px-[64px]"
    : "mx-auto w-full max-w-432 px-5 md:px-8 xl:px-24";

  const mobileNavContainerClasses = isProfileRoute
    ? "mx-auto w-full max-w-[1728px] px-[12px] min-[810px]:px-[32px]"
    : "mx-auto w-full max-w-432 px-5 md:px-8";

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      // Show when scrolling up, hide when scrolling down (past 80px to avoid jitter at top)
      if (current < 80 || current < lastScrollY.current) {
        setVisible(true);
      } else if (current > lastScrollY.current) {
        setVisible(false);
        setMenuOpen(false);
      }
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"} ${isProfileRoute ? "max-[810px]:hidden" : ""}`}>
      <div className={containerClasses}>
        <div className="h-23 xl:h-33 flex items-center justify-between relative">
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
            <nav className="flex items-center rounded-[999px] bg-gradient-to-b from-[rgba(46,46,46,0.8)] to-[#171717] p-1 backdrop-blur-[5px] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.25)] border-t border-[rgba(161,161,161,0.1)]">
              <Link
                href="/"
                className="rounded-[999px] px-5 pt-2.5 pb-3 text-[16px] font-normal leading-[19.2px] text-white hover:bg-white/10 transition"
              >
                Home
              </Link>
              <Link
                href="/newprofiles"
                className="rounded-[999px] px-5 pt-2.5 pb-3 text-[16px] font-normal leading-[19.2px] text-white hover:bg-white/10 transition"
              >
                Profiles
              </Link>
              <Link
                href="/templates"
                className="rounded-[999px] px-5 pt-2.5 pb-3 text-[16px] font-normal leading-[19.2px] text-white hover:bg-white/10 transition"
              >
                Templates
              </Link>
              <Link
                href="/pricing"
                className="rounded-[999px] px-5 pt-2.5 pb-3 text-[16px] font-normal leading-[19.2px] text-white hover:bg-white/10 transition"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="rounded-[999px] px-5 pt-2.5 pb-3 text-[16px] font-normal leading-[19.2px] text-white hover:bg-white/10 transition"
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
                className="inline-flex items-center justify-center rounded-[999px] bg-white px-8 py-3 text-[16px] font-medium leading-[19.2px] tracking-[-0.16px] text-black hover:bg-[#ececec] transition"
              >
                Join now
              </a>
            </div>

            <div className="flex min-[811px]:hidden items-center gap-2">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black-600 bg-[#0b0b0b]"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                <span
                  className={`absolute h-0.5 w-5 rounded-full bg-[#e3e3e3] transition-all duration-300 ${menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
                    }`}
                />
                <span
                  className={`absolute h-0.5 w-5 rounded-full bg-[#e3e3e3] transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"
                    }`}
                />
                <span
                  className={`absolute h-0.5 w-5 rounded-full bg-[#e3e3e3] transition-all duration-300 ${menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`${mobileNavContainerClasses} overflow-hidden min-[811px]:hidden transition-all duration-300 ${menuOpen ? "max-h-105 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
          }`}
      >
        <div
          className={`rounded-2xl border border-black-400 bg-[#101010] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-2"
            }`}
        >
          <Link
            href="/newprofiles"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Profiles
          </Link>
          <Link
            href="/templates"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Pricing
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]">
            Blog
          </Link>
          <a
            href="#join"
            onClick={(event) => { scrollToSection(event, "join"); }}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Join now
          </a>
        </div>
      </nav>
    </header>
  );
}

export default function LandingHeader() {
  return (
    <Suspense fallback={null}>
      <LandingHeaderContent />
    </Suspense>
  );
}
