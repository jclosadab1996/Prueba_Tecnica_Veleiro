/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Ensure we're not using static export which is incompatible with API routes
  trailingSlash: false,
};

module.exports = nextConfig;