/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  webpack: (config, { isServer, nextRuntime }) => {
    // Avoid AWS SDK Node.js require issue
    if (isServer && nextRuntime === "nodejs")
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ })
      );
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "eric-glickman-tondreau-sepa-uploadsbucketc4b27cc7-dszdwofuf572.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/private/**",
      },
    ],
  },
};

module.exports = nextConfig;
