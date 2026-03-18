/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://sophie-api.YOUR_SUBDOMAIN.workers.dev',
  }
}

module.exports = nextConfig
