/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode:true,
  webpack: (config) => {
    config.cache = false;
    return config;
  },
}

module.exports = nextConfig
