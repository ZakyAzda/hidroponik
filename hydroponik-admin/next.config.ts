import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Port backend Nest.js Anda
        pathname: '/uploads/**', // Izinkan akses ke folder uploads
      },
    ],
  },
};

export default nextConfig;