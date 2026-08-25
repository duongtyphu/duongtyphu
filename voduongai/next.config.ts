import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Founder yêu cầu chuyển mục ở Menu `/v2/*` phải nhanh như đổi tab NỘI
   * BỘ 1 trang (vd 7 tab trong `/v2/hoc-vien-ai` — đổi tức thì vì chỉ là
   * `useState`, không có request mạng nào). Đổi TRANG (khác route hẳn) thì
   * luôn cần Ít nhất 1 request đầu tiên (route mới cần tải dữ liệu thật
   * riêng của nó) — nhưng Next.js có "Client Router Cache" giữ lại RSC
   * payload đã tải ở TRÌNH DUYỆT trong 1 khoảng thời gian, tái dùng ngay
   * (0 request) nếu quay lại đúng route đó trong khoảng đó — đúng cơ chế
   * khiến việc "bấm qua lại vài mục quen thuộc" cảm giác gần như tab.
   *
   * MẶC ĐỊNH của Next.js 15+ (đã xác nhận qua
   * `node_modules/next/dist/docs/.../staleTimes.md`, theo đúng yêu cầu
   * AGENTS.md — không đoán): route ĐỘNG (mọi trang `/v2/*`, đọc session
   * mỗi request) có TTL cache = 0 giây — nghĩa là dù đã tải 1 lần, quay lại
   * NGAY LẬP TỨC vẫn tải lại từ đầu. Route đã `router.prefetch()` (đã thêm
   * ở sidebar 2.0, xem mục "Sửa nguyên nhân gốc thứ 2" trong CLAUDE.md)
   * mặc định được 5 phút — NHƯNG chỉ áp dụng đúng route vừa hover/focus,
   * không áp dụng cho route quay lại SAU KHI đã điều hướng đi (cache theo
   * segment, không phải theo "đã từng ghé qua trong phiên").
   *
   * `dynamic: 30` khôi phục đúng mức mặc định Next.js dùng SUỐT nhiều năm
   * trước bản 15 (đổi về 0 mới là thay đổi gần đây, không phải "chuẩn" duy
   * nhất) — quay lại 1 route `/v2/*` bất kỳ trong 30 giây tái dùng thẳng
   * dữ liệu đã tải, KHÔNG gọi lại server. `static: 300` giữ đúng mặc định
   * (route đã `prefetch()` tường minh).
   *
   * Đánh đổi CẦN GHI RÕ (không giấu): trong đúng 30 giây đó, nếu người
   * dùng sửa dữ liệu ở 1 trang (vd tạo Mục tiêu mới ở `/v2/muc-tieu`) rồi
   * quay LẠI 1 trang đã ghé trước đó có hiển thị dữ liệu liên quan (vd
   * "Mục tiêu hiện tại" ở `/v2/companion`), trang đó có thể hiện dữ liệu
   * CŨ tới 30 giây trước khi tự làm mới. Đây là đánh đổi tốc độ-vs-tươi
   * mới CÓ CHỦ ĐÍCH, đúng tinh thần Founder yêu cầu ("phải tải ngay tức
   * thì") — người dùng có thể F5 thủ công nếu cần thấy ngay dữ liệu mới
   * nhất, đúng cách web app thông thường vẫn hoạt động.
   */
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
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
      // Giai đoạn 9 (gộp Học viện AI 2.0) — 2 route hub cũ đã gộp vào
      // /v2/hoc-vien-ai (7 tab nội bộ), route cũ redirect về route mới,
      // không để 404. CHỈ redirect đúng path trần — KHÔNG dùng :path*, vì
      // 4 route con của /v2/he-tri-thuc ([slug]/bai-hoc/bo-suu-tap/danh-muc)
      // vẫn còn sống thật (trang chi tiết tài liệu/lesson/collection/danh
      // mục CKOS), không được redirect đè lên.
      { source: "/v2/he-tri-thuc", destination: "/v2/hoc-vien-ai", permanent: true },
      { source: "/v2/ai-workspace", destination: "/v2/hoc-vien-ai", permanent: true },
    ];
  },
};

export default nextConfig;
