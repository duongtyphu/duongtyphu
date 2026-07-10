import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/portal/growth", destination: "/portal/build", permanent: true },
      { source: "/portal/ecosystem", destination: "/portal/connect", permanent: true },
      // Ecosystem slug rename — URL cũ redirect về URL mới đúng tên gọi, không để 404.
      { source: "/portal/duan-cohoi/crypto", destination: "/portal/duan-cohoi/blockchain-crypto", permanent: true },
      { source: "/portal/duan-cohoi/blockchain", destination: "/portal/duan-cohoi/lam-affilate", permanent: true },
      { source: "/portal/duan-cohoi/trading", destination: "/portal/duan-cohoi/sangiaodich", permanent: true },
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
      // Journey Platform P6 — Sanctuary archive hoàn tất (Product Owner
      // Decision 2): Thought Seeds + câu hỏi Reflection đã MERGE vào Mirror
      // (P4), nội dung định hướng hành trình đã MERGE vào Journey Map (P6).
      // Route mồ côi cũ redirect về Hub — không còn 2 hệ Journey song song.
      { source: "/portal/hanh-trinh-cua-toi", destination: "/portal/hanhtrinhcuatoi", permanent: true },
      { source: "/blog", destination: "/blogai", permanent: true },
      { source: "/blog/:path*", destination: "/blogai/:path*", permanent: true },
      // Community Campus Reconstruction — student-success (câu chuyện bịa,
      // archived) gộp vào Community Stories thật; updates (tin tức thật)
      // chuyển hẳn vào khối Community News trên trang Community mới. (experts
      // giữ redirect ở page.tsx của chính nó, đã trỏ lại đích mới.)
      { source: "/portal/student-success", destination: "/portal/congdongai", permanent: true },
      { source: "/portal/updates", destination: "/portal/congdongai#tin-tuc", permanent: true },
    ];
  },
};

export default nextConfig;
