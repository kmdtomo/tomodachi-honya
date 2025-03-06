import type { NextConfig } from "next";

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
      {
        protocol: 'http',
        hostname: 'books.google.com',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
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
