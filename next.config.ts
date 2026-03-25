import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
