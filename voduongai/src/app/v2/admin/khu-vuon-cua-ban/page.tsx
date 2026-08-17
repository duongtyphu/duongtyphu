import "../../inter-gf.css";
import "../../khu-vuon-cua-ban/khu-vuon-cua-ban.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Khu vườn của bạn — Admin" };

/**
 * `/v2/admin/khu-vuon-cua-ban` — khớp trực quan `/v2/khu-vuon-cua-ban`
 * (CSS `.kvcb`). Portal đọc NGUYÊN `getJourneyOverview()` (giống "Hành
 * trình của tôi" 2.0) — trang này KHÔNG có hệ thống dữ liệu riêng nào
 * khác (garden/quest/inventory là lớp gamification hoàn toàn không có
 * backing thật, đã ghi rõ trong `KhuVuonCuaBanClient.tsx`) nên không có
 * nội dung CMS để quản lý ở đây.
 */
export default function AdminKhuVuonCuaBanPage() {
  return (
    <AdminPortalMirror
      prefix="kvcb"
      title="Quản lý Khu vườn của bạn"
      description="Trang này dùng nguyên dữ liệu hành trình học tập thật (Học viện AI) — lớp gamification vườn/nhiệm vụ/kho đồ không có hạ tầng dữ liệu thật, không có gì để quản lý ở đây."
      stats={[]}
      note="Nội dung đứng sau (giai đoạn lộ trình/khoá học) quản lý ở trang 'Học viện AI'."
      links={[{ label: "Quản lý nội dung Học viện AI (2.0) →", href: "/v2/admin/hoc-vien-ai" }]}
    />
  );
}
