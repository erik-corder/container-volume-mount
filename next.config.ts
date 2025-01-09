import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        source: "/sitemaps/:filename*", // Clean URL
        destination: "/api/sitemaps/:filename*", // Map to the API route
      },
    ];
  },
};

export default nextConfig;
