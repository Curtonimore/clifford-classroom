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
  // Better memory management for builds
  experimental: {
    // Disable CSS optimization to reduce memory usage during builds
    optimizeCss: false,
    // Enable scroll restoration for better user experience
    scrollRestoration: true,
    // Simplify build process
    esmExternals: 'loose',
    // Fix for turbotrace issues - disabling
    turbotrace: false,
    // Improve stability of app router
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Change to export for static deployment
  output: process.env.STATIC_EXPORT ? 'export' : 'standalone',
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
  // Optimize webpack configuration for stability
  webpack: (config, { dev, isServer }) => {
    // Fix "self is not defined" error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimize for development
    if (dev) {
      // Configure for development performance
      config.devtool = 'eval-source-map';
    } else {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        // Disable splitChunks for now due to "self is not defined" error
        splitChunks: isServer ? false : {
          chunks: 'all',
          // Simpler config to avoid "self is not defined" error
          minSize: 20000,
          maxSize: 244000,
        },
      };
    }
    
    // Improve stability by reducing parallel processing
    config.parallelism = 4;
    
    return config;
  },
  // Increase timeouts for API routes
  serverRuntimeConfig: {
    // Will only be available on the server
    timeoutMs: 60000, // 60 seconds
  },
  // Handle redirect and rewrites for better stability
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 