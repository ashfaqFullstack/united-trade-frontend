/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  /* config options here */
  allowedDevOrigins: ['192.168.1.11'],
  images: {
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
