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
};

export default nextConfig;
