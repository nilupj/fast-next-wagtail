
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['0.0.0.0', 'localhost', 'example.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '0.0.0.0',
        port: '8001',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://0.0.0.0:8001/api/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'http://0.0.0.0:8001/media/:path*',
      }
    ];
  },
}

module.exports = nextConfig
