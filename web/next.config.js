/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone', // Commented out for Vercel deployment
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
