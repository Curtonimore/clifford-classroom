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
};

module.exports = nextConfig; 