/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile pictures
    ],
    // Optionally, you can add more domains as needed
    // domains: ['lh3.googleusercontent.com', 'example.com', 'another-domain.com']
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