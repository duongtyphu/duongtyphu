import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/portal/growth", destination: "/portal/build", permanent: true },
    ];
  },
};

export default nextConfig;
