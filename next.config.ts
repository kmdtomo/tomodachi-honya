import type { NextConfig } from "next";

// next.config.js
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vfuffoagirakrvfaitfb.supabase.co',
        pathname: '/storage/v1/object/public/tomodati-bookstore/**',
      },
      {
        protocol: 'https',
        hostname: 'vfuffoagirakrvfaitfb.supabase.co',
        pathname: '/storage/v1/object/tomodati-bookstore/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
