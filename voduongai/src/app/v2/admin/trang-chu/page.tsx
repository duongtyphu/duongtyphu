import "../../inter-gf.css";
import "../../trang-chu/trang-chu.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Trang chủ Portal — Admin" };

/**
 * `/v2/admin/trang-chu` — khớp trực quan `/v2/trang-chu` (CSS `.tcp`).
 *
 * PHÁT HIỆN QUAN TRỌNG khi audit trước khi build (không tự sửa, ngoài
 * phạm vi việc này): `/v2/trang-chu/page.tsx` là trang "lõi" dựng ở Phase
 * 3 (trước khi kỷ luật NO-FAKE-DATA của Bước F được áp dụng cho 17 trang
 * còn lại) — TOÀN BỘ nội dung (banner chào mừng, "Tiếp tục học tập" 4
 * khoá với % tiến độ, "Gợi ý dành cho bạn", khối "Xin chào Võ Đương —
 * Premium Monthly, hết hạn 01/06/2025", XP/streak...) vẫn HARDCODE 100%
 * trong JSX, KHÔNG có `@/lib/portal/live-*` nào — khác hẳn 16 trang Portal
 * 2.0 còn lại đã nối dữ liệu thật. Nối dữ liệu thật cho trang chủ (cần
 * bảng CMS mới cho banner/quick-explore + tính tiến độ per-user thật) là
 * việc RIÊNG, lớn hơn phạm vi "xây 25 trang Admin" — không tự làm ở đây.
 *
 * Vì vậy KHÔNG có "Sửa nhanh"/link quản lý nào ở trang này (không có gì
 * thật để quản lý) — chỉ hiện đúng trạng thái thật, tránh dựng CRUD giả
 * cho nội dung chưa có bảng backing.
 */
export default function AdminTrangChuPage() {
  return (
    <AdminPortalMirror
      prefix="tcp"
      title="Quản lý Trang chủ Portal"
      description="Trang chủ Portal 2.0 hiện vẫn là nội dung tĩnh trong code (banner/khoá đang học/gợi ý/XP đều hardcode), CHƯA có bảng Supabase nào backing — khác các trang Portal 2.0 khác đã nối dữ liệu thật."
      stats={[]}
      note="Chưa có gì để quản lý qua Admin — nội dung trang chủ 2.0 chưa được nối vào Supabase (cần 1 việc riêng: tạo bảng CMS cho banner/quick-explore, tương tự home_cards ở Admin 1.0, trước khi có trang quản lý thật ở đây)."
      links={[]}
    />
  );
}
