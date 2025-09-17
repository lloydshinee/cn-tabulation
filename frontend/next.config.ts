import type { NextConfig } from "next";
import ip from "ip"; // 👈 auto-detect LAN IP

const address = ip.address();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: `http://${address}:3001`,
    NEXT_PUBLIC_SOCKET_URL: `http://${address}:3003`,
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: address,
        port: "3001",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
