/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**/*",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**/*",
      },
    ],
  },
  // experimental: {
  //     turbo: {
  //         resolveAlias: {
  //             underscore: 'lodash',
  //         },
  //     },
  // },
  // transpilePackages: ['lodash-es'],
};

module.exports = nextConfig;
