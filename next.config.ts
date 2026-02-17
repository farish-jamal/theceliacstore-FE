import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "logo.clearbit.com",
      "images.unsplash.com",
      "upload.wikimedia.org",
      "res.cloudinary.com",
      "i0.wp.com",
      "theceliacstore.com",
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: "/shop",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/shop/page/:slug*",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;