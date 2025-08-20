/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/flowforge' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/flowforge/' : '',
  
  // Static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
