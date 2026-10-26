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
};

export default nextConfig;
