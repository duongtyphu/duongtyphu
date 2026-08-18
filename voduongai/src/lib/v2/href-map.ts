/**
 * Đích điều hướng của mockup Portal 2.0 (tên file `.html`) → route thật
 * trong `/v2` — DÙNG CHUNG cho `PortalV2Shell` (Bước F, 42 trang còn lại) và
 * 3 trang đã build trước đó (`he-tri-thuc`/`hoc-vien-ai`/`ai-workspace` vẫn
 * giữ bản khai riêng trong từng Client Component, KHÔNG đổi sang import file
 * này — tránh động vào 3 trang đã verify/commit xong ngoài phạm vi Bước F).
 */
export const PORTAL_HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "Su menh Companion.html": "/v2/su-menh-companion",
  "Bo nho ca nhan hoa.html": "/v2/bo-nho-ca-nhan-hoa",
  "He tri thuc CKOS.html": "/v2/he-tri-thuc",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/ai-workspace",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Cong dong AI.html": "/v2/cong-dong-ai",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

/** Đích điều hướng Admin 2.0 (tên file `.html`) → route thật trong `/v2/admin`. */
export const ADMIN_HREF_MAP: Record<string, string> = {
  "Admin Dashboard.html": "/v2/admin/dashboard",
  "Admin Quan ly Menu.html": "/v2/admin/quan-ly-menu",
  "Admin Bao cao Analytics.html": "/v2/admin/bao-cao",
  "Admin Thu vien Media.html": "/v2/admin/thu-vien-media",
  "Admin Landing Page.html": "/v2/admin/landing-page",
  "Admin Trang Phap ly.html": "/v2/admin/trang-phap-ly",
  "Admin Trang chu.html": "/v2/admin/trang-chu",
  "Admin Companion.html": "/v2/admin/companion",
  "Admin He tri thuc.html": "/v2/admin/he-tri-thuc",
  "Admin Hoc vien AI.html": "/v2/admin/hoc-vien-ai",
  "Admin AI Workspace.html": "/v2/admin/ai-workspace",
  "Admin Du an Co hoi.html": "/v2/admin/du-an-co-hoi",
  "Admin Premium.html": "/v2/admin/premium",
  "Admin Chuong trinh Affilate.html": "/v2/admin/affiliate",
  "Admin Cong dong AI.html": "/v2/admin/cong-dong-ai",
  "Admin Nhat ky hoc tap.html": "/v2/admin/nhat-ky-hoc-tap",
  "Admin Hanh trinh cua toi.html": "/v2/admin/hanh-trinh-cua-toi",
  "Admin Khu vuon cua ban.html": "/v2/admin/khu-vuon-cua-ban",
  "Admin Nguoi dung.html": "/v2/admin/nguoi-dung",
  "Admin Thanh toan Giao dich.html": "/v2/admin/thanh-toan",
  "Admin Thong bao.html": "/v2/admin/thong-bao",
  "Admin Tich hop API.html": "/v2/admin/tich-hop-api",
  "Admin Ho tro Ticket.html": "/v2/admin/ho-tro",
  "Admin Cau hinh he thong.html": "/v2/admin/cau-hinh",
  "Trang chu Portal.html": "/v2/trang-chu",
};
