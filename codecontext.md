# Travingat Codebase Context

Welcome to the Travingat codebase! This document provides a high-level overview of the architecture, folder structure, and key patterns used in this project to help you get up to speed quickly.

## Tech Stack
- **Framework:** Next.js 16.1 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/postcss`)
- **Database:** PostgreSQL (Neon Serverless)
- **Storage:** Cloudflare R2 / AWS S3 SDK for direct client uploads
- **State & Data fetching:** React Server Components (RSC) and standard Client Components (`"use client"`)

## Directory Structure

All main application code is housed within the `src/` directory.

### `src/app/`
This is the routing layer (Next.js App Router).
- **`(public routes)`**: Contains publicly accessible pages.
  - `/profiles/[id]`: The core dynamic profile pages where users showcase their travel portfolios.
  - `/blog`, `/pricing`, `/templates`, `/featured-profiles`: Standard landing and content pages.
- **`/admin`**: The internal custom CMS and dashboard. This is protected by authentication and allows admins to manage users, blogs, and testimonials via a GUI.
- **`/api`**: Backend route handlers (e.g., presigning R2 uploads, waitlist processing).

### `src/features/`
This directory contains domain-specific logic, grouping components and utilities by their business feature rather than technical type.
- **`/profilepages`**: Contains the logic and components for rendering a user's travel profile.
  - **Component Split Pattern**: Because the `ProfileComponent` can get very large, we split complex UI blocks into smaller isolated components based on viewport. For example, `ProfileDesktopHero.tsx` handles the rigid pixel-perfect layout for desktops, while `MobileProfile.tsx` handles the mobile-specific layout. This keeps responsive logic clean and prevents CSS collision.

### `src/components/`
This directory holds reusable, generic UI components used across multiple features.
- **`/ui`**: Atomic components like buttons, modals, or specialized wrappers (e.g., `<LoadedImage />` for handling image loading states).
- **`/sections` & `/layout`**: Larger reusable layout blocks (e.g., `LandingHeader.tsx`, `LandingFooter.tsx`).

### `src/lib/`
Contains core backend integrations and pure utility functions.
- `db.ts`: Neon database connection configuration.
- `r2-upload.ts`: Cloudflare R2 connection logic.
- `landing-assets.ts`: Utilities for resolving CDN image paths (like `toLandingAssetUrl`).

## Key Architectural Patterns

1. **Pixel-Perfect Figma Fidelity**: We strive to match Figma designs exactly. If a specific gap or padding is requested (e.g., `pt-[48px]`), we use precise Tailwind arbitrary values.
2. **Responsive Component Isolation**: Instead of cluttering a single component with dozens of `lg:`, `md:`, and `max-md:` prefixes, we often render entirely different components based on the viewport (e.g. rendering `<MobileHero />` on small screens and hiding it on desktop).
3. **Data Flow**: We default to Server Components for data fetching. Interactive islands (like image carousels or dropdown menus) are marked with `"use client"` and kept as small as possible.
