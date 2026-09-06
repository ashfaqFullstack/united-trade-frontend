/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.7'],
  images: {
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
