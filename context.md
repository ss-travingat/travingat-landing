# Travingat Landing Page & Waitlist Codebase Context

## Overview
This repository contains the landing page, waitlist, and early-access profile platform for **Travingat**. It's designed to showcase travel profiles (including countries visited, media collections, and social links), collect waitlist signups, and provide an admin dashboard for profile management.

## Tech Stack
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript
- **Component Primitives**: [Radix UI](https://www.radix-ui.com/) (Tabs, Tooltips)
- **Database**: [Neon Database (Serverless)](https://neon.tech/)
- **Cloud Storage**: AWS S3 (via `@aws-sdk/client-s3` for uploading profile media)
- **Email**: Nodemailer (presumably for waitlist confirmation emails)
- **Design/Animation**: Framer integration (via `components/framer`)

## Key Directories and Architecture

### 1. `app/` (Next.js App Router)
Handles routing and pages for the application.
- `app/api/`: API endpoints, specifically for profiles (CRUD, uploads) and waitlist operations.
- `app/profiles/[id]/`: Public-facing view of a specific travel profile (renders dynamic routes based on IDs or handles).
- `app/admin/`: Admin dashboard pages (e.g., `/admin/profiles` for creating/editing traveler profiles).
- `app/waitlist/`: Standalone waitlist page and confirmation flow.
- `app/designsystem/`: A showcase page for the design system and UI components.
- Other marketing pages like `app/blog/`, `app/pricing/`, etc.

### 2. `components/`
Reusable UI components.
- `components/ui/`: Contains primitive UI elements (buttons, inputs, waitlist popups, Radix wrappers).
- `components/designsystem/`: Components specifically built to preview the design system (typography, colors, buttons).
- `components/framer/`: Components integrated with Framer, like `mobile-waitlist.tsx`.
- **Core Layouts**: `LandingHeader.tsx`, `LandingFooter.tsx`, and `LandingParallax.tsx`.

### 3. `profiles/`
Contains the core components and data structures for rendering the complex traveler profiles.
- `ProfileComponent.tsx`: The primary complex component responsible for rendering a user's travel profile, including their avatar, stats, interactive flags map, media carousels, and share functionality.
- `CountryDetailComponent.tsx` & `CollectionDetailComponent.tsx`: Detailed views for specific countries or photo collections within a profile.

### 4. `sections/`
Contains modular, full-width page sections primarily used on the `LandingPage.tsx` or other marketing pages (e.g., `HeroSection`, `TestimonialSection`, `FeaturedProfiles`, `PricingSection`).

### 5. `data/` and `lib/`
- `data/`: Contains mock data like `demo-profiles.ts` for previewing profiles before the DB is populated.
- `lib/`: Shared utility functions, API clients, and helper methods (e.g., formatting asset URLs via `landing-assets.ts`).

### 6. `scripts/`
Maintenance scripts defined in `package.json`:
- `sync-inter-display-fonts.mjs`: Script to pull or sync the custom Inter Display font.
- `upload-public-assets-to-r2.mjs`: Script for uploading static assets to Cloudflare R2 / S3 storage.

## Recent Adjustments Context
- Adjustments are being made to precisely match Figma specifications, specifically optimizing responsive padding, spacing (e.g. standardizing Tailwind `space-y-*` values), and gap alignment on components like `ProfileComponent.tsx`. 
- There's a strong emphasis on maintaining distinct layouts for mobile (`lg:hidden`) and desktop (`hidden lg:grid`) while rendering complex media grids (like visited country flags).
