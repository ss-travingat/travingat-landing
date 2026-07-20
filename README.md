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

## Blog Storage In Production

Blog CRUD now uses a JSON object in Cloudflare R2 instead of writing to the local filesystem.

Required environment variables:
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

Optional:
- `R2_BLOGS_JSON_KEY` (default: `landingpage-assets/data/blogs.json`)

Behavior:
- In production, blog APIs require R2 configuration.
- On first run, if the R2 JSON object does not exist yet, the API seeds it from `src/data/blogs.json` automatically.

## Structure

- `app/` App Router entrypoint
- `components/`, `sections/` Landing UI modules
- `data/` Local demo content used by sections
- `public/` All static assets used by landing page

The testimonials endpoint is local at `GET /api/testimonials` and uses `data/testimonials.json`.
 this is important project
 
