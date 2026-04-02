/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["geist"],
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iplsqewa1jv1ew7a.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
