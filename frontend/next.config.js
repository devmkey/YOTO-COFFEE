/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 768, 1024, 1280, 1536],
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = nextConfig;
