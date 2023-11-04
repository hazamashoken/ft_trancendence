/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
