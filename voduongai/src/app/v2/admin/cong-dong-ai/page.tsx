import "../../inter-gf.css";
import "../../cong-dong-ai/cong-dong-ai.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Cộng đồng AI — Admin" };

/**
 * `/v2/admin/cong-dong-ai` — khớp trực quan `/v2/cong-dong-ai` (CSS
 * `.cda`). Portal 2.0 (`CongDongAiClient.tsx`) hiển thị TRUNG THỰC
 * trạng thái trống — trang KHÔNG đọc bất kỳ bảng nào (đã xác nhận qua
 * `page.tsx` chỉ gọi `getPremiumStatus()`, không có `@/lib/portal/live-*`
 * nào khác) vì hệ thống chưa có hạ tầng social feed/thảo luận thật. Admin
 * 1.0 CÓ 3 route liên quan ("Cộng đồng" — `/admin/community`/
 * `/admin/updates`/`/admin/student-success-stories`) nhưng nuôi khối
 * "Community News"/kênh liên hệ ở `/portal/congdongai` (1.0, trang KHÁC
 * hẳn `/v2/cong-dong-ai`) — không phải nguồn của trang 2.0 này, nên
 * KHÔNG trỏ nhầm sang đó.
 */
export default function AdminCongDongAiPage() {
  return (
    <AdminPortalMirror
      prefix="cda"
      title="Quản lý Cộng đồng AI"
      description="Trang Cộng đồng AI 2.0 hiện chưa đọc bảng dữ liệu nào — Portal hiển thị đúng trạng thái trống trung thực vì chưa có hạ tầng social feed/thảo luận thật cho riêng 2.0."
      stats={[]}
      note="Không có nội dung nào để quản lý ở đây (không phải lỗi — đúng trạng thái honest-empty của Portal). 'Community News'/kênh liên hệ ở /admin/community, /admin/updates (Admin 1.0) nuôi trang /portal/congdongai (1.0) — trang KHÁC, không phải nguồn của /v2/cong-dong-ai."
      links={[]}
    />
  );
}
