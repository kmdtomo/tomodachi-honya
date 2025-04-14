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
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/**',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/**',
      },
      {
        protocol: 'https',
        hostname: 'books.googleapis.com',
        pathname: '/books/**',
      },
      {
        protocol: 'http',
        hostname: 'books.googleapis.com',
        pathname: '/books/**',
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
