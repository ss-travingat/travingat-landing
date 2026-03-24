# Travingat Landing (Standalone)

This folder is now a standalone Next.js app that can be deployed independently from the main product app.

## Run Locally

```bash
cd landing
npm install
npm run dev
```

Open http://localhost:3000

## Build For Production

```bash
cd landing
npm run build
npm run start
```

## Deploy

This app can be deployed to any Next.js hosting provider (for example Vercel, Netlify, Render, Railway, self-hosted Node).

Required runtime:
- Node.js 20+

## Structure

- `app/` App Router entrypoint
- `components/`, `sections/` Landing UI modules
- `data/` Local demo content used by sections
- `public/` All static assets used by landing page

The testimonials endpoint is local at `GET /api/testimonials` and uses `data/testimonials.json`.
