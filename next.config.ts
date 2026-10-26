import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    localPatterns: [
      { pathname: "/covers/**" },
      { pathname: "/uploads/**" },
      { pathname: "/hero/**" },
      { pathname: "/brand/**" },
      { pathname: "/categories/**" },
    ],
  },
  // Standalone only serves public files from the build. Runtime admin
  // uploads live on disk under public/uploads but are not in that map.
  async rewrites() {
    return [
      {
        source: "/uploads/:filename",
        destination: "/api/media/:filename",
      },
    ];
  },
};

export default nextConfig;
