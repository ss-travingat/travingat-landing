export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Fast checks: We want Framer to natively handle:
    // 1. Asset extensions (files)
    // 2. Non-GET requests (like POSTing a password form)
    // 3. Framer's internal API/auth routes (starting with /__ or /_api)
    if (
      request.method !== 'GET' ||
      path.startsWith('/__') ||
      path.startsWith('/_api') ||
      path.startsWith('/api') ||
      path.startsWith('/.well-known') ||
      /\.(js|css|png|jpg|jpeg|gif|svg|ico|txt|xml|json|woff|woff2|map|webp|webm|mp4|heic|avif)$/i.test(path)
    ) {
      return fetch(request);
    }

    // List of known top-level routes from your Framer sitemap
    const framerRoutes = new Set([
      '/',
      '/profiles',
      '/templates',
      '/explorer-card',
      '/get-featured',
      '/pricing',
      '/privacy',
      '/terms',
      '/about',
      '/blog',
      '/404'
    ]);

    // Get the first segment of the path (e.g. "/johndoe" -> "/johndoe", "/blog/post-1" -> "/blog")
    // For the root path "/", match will be "/"
    const firstSegment = path === '/' ? '/' : `/${path.split('/')[1]}`;

    // If the path starts with a known Framer route, let Framer handle it
    if (framerRoutes.has(firstSegment)) {
      return fetch(request);
    }

    // Otherwise, it must be a profile (or an unknown route).
    // Redirect instantly to the Next.js app without an extra HTTP roundtrip!
    const appUrl = new URL(path + url.search, "https://app.travingat.com");
    return Response.redirect(appUrl.toString(), 301);
  },
};
