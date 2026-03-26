import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-73816168e54041228c76b8c06deb5f76.r2.dev",
        pathname: "/landingpage-assets/**",
      },
    ],
  },
};

export default nextConfig;
