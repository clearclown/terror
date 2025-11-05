import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone', // Commented out for Vercel deployment
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
