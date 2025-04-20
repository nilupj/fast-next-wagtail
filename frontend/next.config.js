
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['0.0.0.0', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '0.0.0.0',
        port: '8001',
        pathname: '/media/**',
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
