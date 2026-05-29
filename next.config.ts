import path from 'node:path'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  webpack: config => {
    return config
  },
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.midasfun.com'
      }
    ]
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/admin/home/management',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
