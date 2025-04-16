/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  amp: {
    canonicalBase: 'https://healthinfo.com',
  },
  images: {
    domains: ['0.0.0.0', 'localhost', 'healthinfocms.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://0.0.0.0:8001/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig