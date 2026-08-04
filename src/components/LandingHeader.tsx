"use client";

import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

// Standalone React header export generated from the Framer "Modern Navbar" design for direct use in Next.js/React apps.

export type TravingatNavItem = {
    label: string
    href: string
}

export type TravingatHeaderProps = {
    logoHref?: string
    logoSrc?: string
    navItems?: TravingatNavItem[]
    ctaLabel?: string
    ctaHref?: string
    className?: string
}

type MobileNavItem = TravingatNavItem & {
    __cta?: boolean
}

function normalizePath(path: string): string {
    const raw = (path || "").trim()
    if (!raw) return ""
    if (raw.startsWith("#") || raw.startsWith("?")) return ""
    try {
        const base =
            typeof window !== "undefined"
                ? window.location.origin
                : "https://example.com"
        const url = new URL(raw, base)
        let pathname = url.pathname || "/"
        if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1)
        return pathname
    } catch {
        let pathname = raw.split("#")[0].split("?")[0] || "/"
        if (!pathname.startsWith("/")) pathname = `/${pathname}`
        if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1)
        return pathname
    }
}

export default function LandingHeader({
    logoHref = "/",
    logoSrc = "/icons/travingat-logo.svg?v=newlogo",
    navItems = [
        { label: "Home", href: "/" },
        { label: "Profiles", href: "/newprofiles" },
        { label: "Templates", href: "/templates" },
        { label: "Pricing", href: "/pricing" },
        { label: "Blog", href: "/blog" },
    ],
    ctaLabel = "Join now",
    ctaHref = "/#join",
    className = "",
}: TravingatHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [pathname, setPathname] = useState("")
    const [isDesktopActiveEnabled, setIsDesktopActiveEnabled] = useState(false)
    const [hidden, setHidden] = useState(false)
    const searchParams = useSearchParams()
    const isFullScreen = searchParams ? searchParams.has("image") : false

    useEffect(() => {
        if (typeof window === "undefined") return

        const readPath = () => setPathname(normalizePath(window.location.pathname))
        const desktopActiveQuery = window.matchMedia("(min-width: 1200px)")
        const readDesktopActive = () =>
            setIsDesktopActiveEnabled(desktopActiveQuery.matches)
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false)
        }

        let lastScrollY = window.scrollY
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHidden(true)
            } else if (currentScrollY < lastScrollY) {
                setHidden(false)
            }
            lastScrollY = currentScrollY
        }

        readPath()
        readDesktopActive()

        window.addEventListener("popstate", readPath)
        window.addEventListener("hashchange", readPath)
        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("scroll", handleScroll, { passive: true })

        if (typeof desktopActiveQuery.addEventListener === "function") {
            desktopActiveQuery.addEventListener("change", readDesktopActive)
        } else if (typeof desktopActiveQuery.addListener === "function") {
            desktopActiveQuery.addListener(readDesktopActive)
        }

        return () => {
            window.removeEventListener("popstate", readPath)
            window.removeEventListener("hashchange", readPath)
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("scroll", handleScroll)
            if (typeof desktopActiveQuery.removeEventListener === "function") {
                desktopActiveQuery.removeEventListener("change", readDesktopActive)
            } else if (typeof desktopActiveQuery.removeListener === "function") {
                desktopActiveQuery.removeListener(readDesktopActive)
            }
        }
    }, [])

    const mobileItems = useMemo<MobileNavItem[]>(
        () => [...navItems, { label: ctaLabel, href: ctaHref, __cta: true }],
        [navItems, ctaLabel, ctaHref]
    )

    return (
        <header className={`trv-header ${className} ${hidden && !menuOpen ? "is-hidden" : ""} ${isFullScreen ? "is-fullscreen" : ""}`.trim()}>
            <div className={`trv-shell ${menuOpen ? "is-open" : ""}`}>
                <div className="trv-top-row">
                    <a className="trv-logo-link" href={logoHref} aria-label="Go to homepage">
                        <img className="trv-logo" src={logoSrc} alt="Logo" />
                    </a>

                    <nav className="trv-nav-desktop" aria-label="Primary">
                        <ul className="trv-nav-pill">
                            {navItems.map((item) => {
                                const isActive =
                                    isDesktopActiveEnabled &&
                                    normalizePath(item.href) === pathname &&
                                    pathname !== ""
                                return (
                                    <li key={item.href}>
                                        <a
                                            className={`trv-nav-link ${isActive ? "is-active" : ""}`}
                                            href={item.href}
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    <a className="trv-cta-desktop" href={ctaHref}>
                        {ctaLabel}
                    </a>

                    <button
                        type="button"
                        className="trv-menu-btn"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="trv-mobile-nav"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        <span className="trv-menu-lines" aria-hidden="true">
                            <span className="trv-line line-1" />
                            <span className="trv-line line-2" />
                        </span>
                    </button>
                </div>

                <div
                    id="trv-mobile-nav"
                    className={`trv-mobile-drawer ${menuOpen ? "is-open" : ""}`}
                >
                    <nav className="trv-nav-mobile" aria-label="Mobile primary">
                        {mobileItems.map((item) =>
                            item.__cta ? (
                                <a
                                    key={`${item.href}-${item.label}`}
                                    href={item.href}
                                    className="trv-cta-mobile"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <a
                                    key={`${item.href}-${item.label}`}
                                    href={item.href}
                                    className="trv-mobile-link"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            )
                        )}
                    </nav>
                </div>
            </div>

            <style>{`
                .trv-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    color: #ffffff;
                    background: linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);
                    z-index: 100;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .trv-header.is-hidden {
                    transform: translateY(-100%);
                }
                .trv-header.is-fullscreen {
                    display: none;
                }

                .trv-shell {
                    width: 100%;
                    max-width: 390px;
                    margin: 0 auto;
                    box-sizing: border-box;
                    padding: 16px 24px 20px 24px;
                    min-height: 90px;
                    height: 90px;
                    overflow: hidden;
                    transition: height 0.55s cubic-bezier(0.44, 0, 0.56, 1);
                }

                .trv-shell.is-open {
                    height: 528px;
                    background: rgb(0, 0, 0);
                }

                .trv-top-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 342px;
                    gap: 12px;
                }

                .trv-logo-link {
                    display: inline-flex;
                    align-items: center;
                    text-decoration: none;
                    position: relative;
                    top: 0px;
                }

                .trv-header .trv-logo {
                    display: block;
                    width: 120px;
                    height: 24px !important;
                    max-width: none;
                    object-fit: contain;
                }

                .trv-shell.is-open .trv-logo {
                    height: 22px !important;
                }

                .trv-nav-desktop,
                .trv-cta-desktop {
                    display: none;
                }

                .trv-menu-btn {
                    width: 44px;
                    height: 44px;
                    padding: 0;
                    border: 1px solid rgb(33, 33, 33);
                    border-radius: 999px;
                    background: linear-gradient(180deg, rgb(23, 23, 23) 0%, rgb(31, 31, 31) 100%);
                    box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.25);
                    color: #fff;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 auto;
                }

                .trv-menu-lines {
                    position: relative;
                    width: 15px;
                    height: 15px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .trv-line {
                    position: absolute;
                    width: 15px;
                    height: 2px;
                    border-radius: 999px;
                    background: rgb(255, 255, 255);
                    transition: transform 0.45s cubic-bezier(0.44, 0, 0.56, 1);
                    transform-origin: center;
                }

                .line-1 {
                    transform: rotate(0deg);
                }

                .line-2 {
                    transform: rotate(90deg);
                }

                .trv-shell.is-open .line-1 {
                    transform: rotate(135deg);
                }

                .trv-shell.is-open .line-2 {
                    transform: rotate(225deg);
                }

                .trv-mobile-drawer {
                    margin-top: 20px;
                    opacity: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.55s cubic-bezier(0.44, 0, 0.56, 1), opacity 0.45s ease;
                }

                .trv-mobile-drawer.is-open {
                    opacity: 1;
                    max-height: 430px;
                }

                .trv-nav-mobile {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 24px;
                    padding: 16px 0;
                    box-sizing: border-box;
                }

                .trv-mobile-link {
                    width: 100%;
                    text-decoration: none;
                    color: rgb(255, 255, 255);
                    font-family: Inter, sans-serif;
                    font-size: 32px;
                    font-weight: 500;
                    line-height: 1.2em;
                    letter-spacing: 0;
                    text-align: left;
                }

                .trv-cta-mobile {
                    margin-top: 4px;
                    align-self: center;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 120px;
                    min-height: 43px;
                    text-align: center;
                    text-decoration: none;
                    background: rgb(255, 255, 255);
                    color: rgb(0, 0, 0);
                    border-radius: 999px;
                    padding: 12px 32px;
                    font-family: Inter, sans-serif;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 1.2em;
                    letter-spacing: -0.01em;
                    transition: background-color 0.4s cubic-bezier(0.44, 0, 0.56, 1), color 0.4s cubic-bezier(0.44, 0, 0.56, 1);
                    box-sizing: border-box;
                    white-space: nowrap;
                }

                .trv-cta-mobile:hover {
                    background: rgb(90, 69, 249);
                    color: rgb(255, 255, 255);
                }

                @media (min-width: 810px) {
                    .trv-shell {
                        max-width: none;
                        width: 100%;
                        height: auto;
                        min-height: 0;
                        overflow: visible;
                        margin: 0 auto;
                        padding: 32px 64px 48px;
                        background: transparent;
                    }

                    .trv-shell.is-open {
                        height: auto;
                        background: transparent;
                    }

                    .trv-top-row {
                        max-width: none;
                        width: 100%;
                        gap: 32px;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                    }

                    .trv-header .trv-logo {
                        width: 150px;
                        height: 28px !important;
                    }

                    .trv-shell.is-open .trv-logo {
                        height: 28px !important;
                    }

                    .trv-menu-btn,
                    .trv-mobile-drawer {
                        display: none;
                    }

                    .trv-nav-desktop,
                    .trv-cta-desktop {
                        display: block;
                    }

                    .trv-nav-desktop {
                        position: absolute;
                        top: 46%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        margin-top: 2px;
                        z-index: 3;
                        display: flex;
                        justify-content: center;
                    }

                    .trv-nav-pill {
                        display: inline-flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 2px;
                        width: 475.59px !important;
                        height: 49.2px !important;
                        box-sizing: border-box;
                        margin: 0;
                        padding: 3px;
                        list-style: none;
                        border-radius: 999px;
                        border: 1px solid rgba(161, 161, 161, 0.1) !important;
                        background: linear-gradient(180deg, rgba(46, 46, 46, 0.8) 0%, rgb(23, 23, 23) 100%) !important;
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        overflow: clip;
                    }

                    .trv-nav-pill > li {
                        margin: 0;
                        padding: 0;
                        display: flex;
                    }

                    .trv-nav-link {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        min-height: 41px;
                        box-sizing: border-box;
                        text-decoration: none;
                        border-radius: 999px;
                        border: none !important;
                        color: #ffffff !important;
                        padding: 0px 18px;
                        font-family: Inter, sans-serif !important;
                        font-size: 16px !important;
                        font-weight: 500 !important;
                        line-height: 1.2em;
                        letter-spacing: 0.02em !important;
                        white-space: nowrap;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                        transition: background-color 0.25s ease, color 0.25s ease;
                    }

                    .trv-nav-link:hover {
                        color: #ffffff !important;
                        background: rgba(255, 255, 255, 0.08);
                    }

                    .trv-nav-link.is-active {
                        color: #ffffff !important;
                        background: rgba(255, 255, 255, 0.09) !important;
                        border: none !important;
                    }

                    .trv-cta-desktop {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 120px;
                        min-height: 43px;
                        box-sizing: border-box;
                        white-space: nowrap;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 999px;
                        padding: 12px 32px;
                        background: rgb(255, 255, 255);
                        color: rgb(0, 0, 0);
                        font-family: Inter, sans-serif;
                        font-size: 17px !important;
                        font-weight: 500;
                        line-height: 1.2em;
                        letter-spacing: -0.01em;
                        transition: background-color 0.4s cubic-bezier(0.44, 0, 0.56, 1), color 0.4s cubic-bezier(0.44, 0, 0.56, 1);
                    }

                    .trv-cta-desktop:hover {
                        background: rgb(90, 69, 249);
                        color: rgb(255, 255, 255);
                    }
                }
            `}</style>
        </header>
    )
}
