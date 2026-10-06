// /** @type {import('next').NextConfig} */
// const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
// const backendUrl = apiUrl?.endsWith('/v1') ? apiUrl : `${apiUrl}/v1`;

// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/backend/:path*',
//         destination: `${backendUrl}/:path*`,
//       },
//     ];
//   },
//   /* config options here */
//   allowedDevOrigins: ['192.168.1.11'],
//   images: {
//     qualities: [25, 50, 75, 100],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//       },
//     ],
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      // 1. Jab request .com.au domain se aaye
      {
        source: '/api/backend/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*)unitedtradecard.com.au',
          },
        ],
        destination: 'https://api.unitedtradecard.com.au/v1/:path*',
      },
      // 2. Default (.com ya baaki sabhi domains ke liye)
      {
        source: '/api/backend/:path*',
        destination: 'https://api.unitedtradecard.com/v1/:path*',
      },
    ];
  },
  /* config options here */
  allowedDevOrigins: ['192.168.1.11'],
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;