/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // GitHub Pages configuration (only for production)
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/flowforge',
    assetPrefix: '/flowforge/',
    output: 'export',
    images: {
      unoptimized: true,
    },
  }),
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://flowforge-backend-jpfuk7ju1-beingmartinbmcs-projects.vercel.app/api',
  },
}

module.exports = nextConfig
