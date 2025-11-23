import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. Izin untuk Gambar dari Backend Lokal (NestJS)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      // 2. Izin untuk Gambar dari Unsplash (Background Login)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 3. (Opsional) Izin untuk Placehold.co (Jika masih ada dummy image)
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;