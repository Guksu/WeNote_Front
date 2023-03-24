/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/profile",
        destination: "/",
      },
      {
        source: "/project",
        destination: "/",
      },
      {
        source: "/note",
        destination: "/",
      },
      {
        source: "/participation",
        destination: "/",
      },
    ];
  },
  images: {
    domains: ["localhost", "*", "port-0-wenote-back-4uvg2mleqmc0d8.sel3.cloudtype.app"],
  },
};

module.exports = nextConfig;
