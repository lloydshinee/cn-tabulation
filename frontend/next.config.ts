import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["192.168.5.167"], // 👈 explicitly allow your backend host
  },
};

export default nextConfig;
