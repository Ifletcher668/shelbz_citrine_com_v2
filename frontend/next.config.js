/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export only for production builds
  ...(process.env.NODE_ENV === "production" && { output: "export" }),
  // Disable image optimization for static export (use next/image with unoptimized)
  images: {
    unoptimized: true,
  },
  // Trailing slashes for cleaner URLs on static hosts
  trailingSlash: true,
};

module.exports = nextConfig;
