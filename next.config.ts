import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["sharp"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost", "*.devtunnels.ms", "*.inc1.devtunnels.ms", "r7g0rw0w-3000.inc1.devtunnels.ms"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 65, 75],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.travingat.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://travingat.com/",
        permanent: false,
      },
      {
        source: "/profiles",
        destination: "https://travingat.com/profiles",
        permanent: false,
      },
      {
        source: "/pricing",
        destination: "https://travingat.com/pricing",
        permanent: false,
      },
      {
        source: "/templates",
        destination: "https://travingat.com/templates",
        permanent: false,
      },
      {
        source: "/blog",
        destination: "https://travingat.com/blog",
        permanent: false,
      },
      {
        source: "/blog/:slug*",
        destination: "https://travingat.com/blog",
        permanent: false,
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path((?!media-engine).*)",
        destination: `${process.env.BACKEND_URL || "http://localhost:8000"}/api/:path`,
      },
      {
        // Negative lookahead to ensure we don't accidentally rewrite known pages and API routes
        source: "/:username((?!api|admin|blog|pricing|templates|_next|static|favicon\\.ico|waitlist|designsystem|join|featured-profiles|ec|explorercard|edit|getfeatured|view|profiles).*)",
        destination: "/profiles/:username",
      },
    ];
  },
};

export default nextConfig;
