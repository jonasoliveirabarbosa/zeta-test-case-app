import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['app', 'lib', 'components', 'pages'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'streetviewpixels-pa.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
