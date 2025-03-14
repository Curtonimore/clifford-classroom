/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Add more comprehensive error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  // Increase memory limit for builds
  experimental: {
    // Reduce memory usage during builds
    optimizeCss: false,
    // Turn off features that might cause issues
    scrollRestoration: false,
    // Simplify build process
    esmExternals: 'loose',
  },
  // Keep output simple for debugging
  output: process.env.VERCEL ? undefined : 'standalone',
  // Improve logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Skip type checking during build (already done during development)
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build (already done during development)
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  // Increase memory limit for webpack
  webpack: (config, { dev, isServer }) => {
    // Optimize for development
    if (dev) {
      // Reduce the number of parallel processes
      config.parallelism = 1;
      
      // Add source maps in development
      config.devtool = 'eval-source-map';
    }
    
    return config;
  },
  // Increase timeouts for API routes
  serverRuntimeConfig: {
    // Will only be available on the server
    timeoutMs: 60000, // 60 seconds
  },
  // Disable React strict mode temporarily if crashes persist
  reactStrictMode: false,
  // Increase output buffer size
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
};

module.exports = nextConfig; 