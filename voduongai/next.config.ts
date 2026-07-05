import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/portal/growth", destination: "/portal/build", permanent: true },
      { source: "/portal/ecosystem", destination: "/portal/connect", permanent: true },
      // IA & Route Localization Refactor v1.0 — route cũ redirect về route mới, không để 404.
      { source: "/portal/academy", destination: "/portal/hocvienai", permanent: true },
      { source: "/portal/academy/:path*", destination: "/portal/hocvienai/:path*", permanent: true },
      { source: "/portal/khong-gian-ai", destination: "/portal/aiworkspace", permanent: true },
      { source: "/portal/khong-gian-ai/:path*", destination: "/portal/aiworkspace/:path*", permanent: true },
      { source: "/portal/library", destination: "/portal/hetrithucai", permanent: true },
      { source: "/portal/library/:path*", destination: "/portal/hetrithucai/:path*", permanent: true },
      { source: "/portal/opportunities", destination: "/portal/duan-cohoi", permanent: true },
      { source: "/portal/opportunities/:path*", destination: "/portal/duan-cohoi/:path*", permanent: true },
      { source: "/portal/community", destination: "/portal/congdongai", permanent: true },
      { source: "/portal/community/:path*", destination: "/portal/congdongai/:path*", permanent: true },
      { source: "/portal/news", destination: "/portal/nhatkyhoctap", permanent: true },
      { source: "/portal/news/:path*", destination: "/portal/nhatkyhoctap/:path*", permanent: true },
      { source: "/portal/journey", destination: "/portal/hanhtrinhcuatoi", permanent: true },
      { source: "/portal/journey/:path*", destination: "/portal/hanhtrinhcuatoi/:path*", permanent: true },
      { source: "/portal/khu-vuon-cua-ban", destination: "/portal/khuvuoncuaban", permanent: true },
      { source: "/blog", destination: "/blogai", permanent: true },
      { source: "/blog/:path*", destination: "/blogai/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
