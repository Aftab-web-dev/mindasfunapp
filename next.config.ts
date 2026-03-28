import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.midasfun.com',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/admin/home/management',
        permanent: true,
        locale: false,
      },
    ]
  },
}

export default nextConfig
