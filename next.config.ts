import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static generation focus
  output: "standalone",
  images: {
    domains: ["images.unsplash.com", "cdn.jsdelivr.net", "picsum.photos", "placehold.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      }
    ]
  }
};

export default nextConfig;
