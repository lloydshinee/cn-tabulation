import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  ? new URL(process.env.NEXT_PUBLIC_BACKEND_URL).hostname
  : "localhost";

const nextConfig: NextConfig = {
  images: {
    domains: [backendUrl],
  },
};

export default nextConfig;
