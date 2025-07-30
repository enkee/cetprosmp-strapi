/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Ignora errores de linting al hacer `next build`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Ignora errores de tipo al hacer `next build`
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cetprosmp.edu.pe',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
};

module.exports = nextConfig;
