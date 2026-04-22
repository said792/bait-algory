/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // ✅ أضف هذا السطر هنا تماماً كما هو
  allowedDevOrigins: ['10.16.29.110'],
};

export default nextConfig;