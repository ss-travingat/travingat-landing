"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const onboardingUrl = "https://app.travingat.com/";

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="mx-auto w-full max-w-432 px-5 md:px-8 xl:px-24">
        <div className="h-23 xl:h-33 flex items-center justify-between">
          <Link href="/" className="ds-font-logo text-white text-[28px] font-normal leading-none tracking-[0.2px]">
            travingat
          </Link>

          <div className="hidden xl:flex items-center justify-end gap-6">
            <nav className="flex items-center gap-3">
              <Link
                href="/featured-profiles"
                className="rounded-full px-4.5 py-2.5 text-[16px] font-medium leading-6 tracking-[-0.096px] text-white hover:bg-white/5 transition"
              >
                Featured Profiles
              </Link>
              <Link
                href="/templates"
                className="rounded-full px-4.5 py-2.5 text-[16px] font-medium leading-6 tracking-[-0.096px] text-white hover:bg-white/5 transition"
              >
                Templates
              </Link>
              <Link
                href="/pricing"
                className="rounded-full px-4.5 py-2.5 text-[16px] font-medium leading-6 tracking-[-0.096px] text-white hover:bg-white/5 transition"
              >
                Pricing
              </Link>
              <Link href="/blog" className="rounded-full px-4.5 py-2.5 text-[16px] font-medium leading-6 tracking-[-0.096px] text-white hover:bg-white/5 transition">
                Blog
              </Link>
            </nav>

            <a
              href="#join"
              onClick={(event) => scrollToSection(event, "join")}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-[14px] font-medium leading-5 tracking-[-0.084px] text-black hover:bg-[#ececec] transition"
            >
              Join now
            </a>
          </div>

          <div className="flex xl:hidden items-center gap-2">
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

      <nav
        className={`mx-auto w-full max-w-432 overflow-hidden px-5 md:px-8 xl:hidden transition-all duration-300 ${menuOpen ? "max-h-105 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
          }`}
      >
        <div
          className={`rounded-2xl border border-black-400 bg-[#101010] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-2"
            }`}
        >
          <Link
            href="/featured-profiles"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Featured Profiles
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
