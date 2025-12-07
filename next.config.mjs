/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    // Using local images from /public. Add domains here if you load remote images.
    domains: ["cdn.shopify.com"],
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    // Fail the build on TS errors in production for better reliability
    ignoreBuildErrors: false,
  },
}

export default nextConfig
