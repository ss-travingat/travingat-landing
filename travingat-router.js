export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Fast check: If the path has an extension (like .js, .png, .css),
    // it's an asset. We let Framer handle it.
    if (/\.[a-z0-9]+$/i.test(path)) {
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
      '/blog'
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
