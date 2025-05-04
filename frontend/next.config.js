/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/cypherplatxs/web/main/public/**',
      },
    ],
  },
}

module.exports = nextConfig 