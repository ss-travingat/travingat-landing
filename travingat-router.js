export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Fast check: If the path has a known asset extension (like .js, .png, .css),
    // it's a file. We let Framer handle it. We explicitly list extensions so we
    // don't accidentally block usernames that contain dots (like "carlos.sails").
    if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|txt|xml|json|woff|woff2|map)$/i.test(path)) {
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
