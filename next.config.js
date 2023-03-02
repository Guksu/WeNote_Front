/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/profile",
        destination: "/",
        permanent: true,
      },
      {
        source: "/project",
        destination: "/",
        permanent: true,
      },
      {
        source: "/note",
        destination: "/",
        permanent: true,
      },
      {
        source: "/participation",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["localhost", "*", "https://port-0-wenote-back-4uvg2mleqmc0d8.sel3.cloudtype.app/"],
  },
};

module.exports = nextConfig;
