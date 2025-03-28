/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@react-pdf/renderer'],
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
  }
}

module.exports = nextConfig 