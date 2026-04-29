/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"]
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        ignored: /node_modules/
      };
    }
    return config;
  }
};

export default nextConfig;
