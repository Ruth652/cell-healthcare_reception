import type { NextConfig } from "next";

const nextConfig: any = {
  typescript: {
    // Allows production builds to successfully complete even with TS errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig as NextConfig;