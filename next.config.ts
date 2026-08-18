import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    imageSizes: [32, 48, 64, 96, 128, 161, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["simple-icons"],
  },
  async redirects() {
    return [
      // Legacy locale prefixes from the previous site. Remove these when i18n is added.
      {
        source: "/:locale(es|en)",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/:locale(es|en)/:path+",
        destination: "/:path+",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
