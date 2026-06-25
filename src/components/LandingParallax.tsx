"use client";

import { useEffect, useRef } from "react";

export default function LandingParallax({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ua = navigator.userAgent;
    const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|Edg/i.test(ua);
    if (isSafari) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const images = Array.from(root.querySelectorAll("img"));
    if (images.length === 0) return;

    const surfaces = new Map<HTMLElement, number>();

    images.forEach((image, index) => {
      const target = (image.parentElement instanceof HTMLElement ? image.parentElement : image) as HTMLElement;
      const rect = target.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(target);

      if (
        rect.width < 180 ||
        rect.height < 120 ||
        computedStyle.overflow !== "visible" ||
        computedStyle.borderTopLeftRadius !== "0px" ||
        computedStyle.borderTopRightRadius !== "0px" ||
        computedStyle.borderBottomRightRadius !== "0px" ||
        computedStyle.borderBottomLeftRadius !== "0px"
      ) {
        return;
      }

      const depth = 0.24 + (index % 4) * 0.06;
      surfaces.set(target, depth);
      target.style.willChange = "transform";
      target.style.backfaceVisibility = "hidden";
      target.style.transform = "translate3d(0, 0px, 0)";
      target.style.transformOrigin = "center center";
    });

    let frameId = 0;

    const updatePositions = () => {
      frameId = 0;
      const viewportCenter = window.innerHeight / 2;

      surfaces.forEach((depth, surface) => {
        const rect = surface.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = (elementCenter - viewportCenter) / window.innerHeight;
        const translateY = Math.max(-1, Math.min(1, distanceFromCenter)) * depth * 8;

        surface.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
      });
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updatePositions);
    };

    const handleMotionChange = () => scheduleUpdate();

    updatePositions();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMotionChange);
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMotionChange);
      }

      surfaces.forEach((_, surface) => {
        surface.style.willChange = "";
        surface.style.backfaceVisibility = "";
        surface.style.transform = "";
        surface.style.transformOrigin = "";
      });
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}