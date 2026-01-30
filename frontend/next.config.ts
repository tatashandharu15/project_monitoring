import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL 
          ? `${process.env.API_URL}/:path*` 
          : "http://127.0.0.1:9001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
