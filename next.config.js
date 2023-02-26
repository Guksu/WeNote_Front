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
    domains: ["localhost", "*"],
  },
};

module.exports = nextConfig;
