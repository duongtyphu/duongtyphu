/**
 * Portal Page catalog — ADM-SPR-200 Task 3 (Portal Page Registry).
 *
 * READ-ONLY — không phải CRUD. Danh sách này là kết quả liệt kê CƠ HỌC
 * (`find src/app/portal -name page.tsx`) toàn bộ route THẬT đang tồn tại
 * trong Portal, đối chiếu tiền tố URL với 10 Portal Area thật
 * (`areas.ts`). Route không khớp tiền tố Area nào được gán `areaKey: null`
 * ("Unmapped") — KHÔNG đoán Area cho chúng, đúng nguyên tắc "không được
 * đoán" của Founder Directive §7.
 *
 * `note` chỉ điền khi có bằng chứng cụ thể đã xác nhận ở sprint trước
 * (route chết đã xác nhận ở ADM-SPR-005, hoặc phát hiện mới khi lập danh
 * sách này) — không suy diễn thêm cho các route còn lại.
 */

export type PortalPageEntry = {
  path: string;
  areaKey: string | null;
  note?: string;
};

export const PORTAL_PAGES: PortalPageEntry[] = [
  { path: "/portal", areaKey: "home" },
  { path: "/portal/account", areaKey: null },
  { path: "/portal/achievements", areaKey: null },
  { path: "/portal/affiliate-hub", areaKey: null },
  { path: "/portal/ai-academy", areaKey: null },
  { path: "/portal/ai-assistant", areaKey: null },
  { path: "/portal/aiworkspace", areaKey: "aiworkspace" },
  { path: "/portal/aiworkspace/[slug]", areaKey: "aiworkspace" },
  { path: "/portal/aiworkspace/bai-viet/[slug]", areaKey: "aiworkspace" },
  { path: "/portal/aiworkspace/nghe/[slug]", areaKey: "aiworkspace" },
  { path: "/portal/case-studies", areaKey: null },
  { path: "/portal/checklists", areaKey: null },
  { path: "/portal/checkout", areaKey: null },
  { path: "/portal/checkout/order-received/[id]", areaKey: null },
  { path: "/portal/ckos", areaKey: "ckos" },
  { path: "/portal/companion", areaKey: "companion" },
  { path: "/portal/congdongai", areaKey: "congdongai" },
  { path: "/portal/digital-assets", areaKey: null },
  { path: "/portal/digital-assets/[slug]", areaKey: null },
  { path: "/portal/digital-assets/category/[categorySlug]", areaKey: null },
  { path: "/portal/duan-cohoi", areaKey: "duan-cohoi" },
  { path: "/portal/duan-cohoi/[ecosystemSlug]", areaKey: "duan-cohoi" },
  { path: "/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]", areaKey: "duan-cohoi" },
  { path: "/portal/duan-cohoi/bai-viet/[slug]", areaKey: "duan-cohoi" },
  { path: "/portal/earn", areaKey: null },
  { path: "/portal/experts", areaKey: null },
  { path: "/portal/goals", areaKey: null, note: "Không nằm trong 5 cửa Journey đã tài liệu hóa — chưa xác nhận có thuộc Hành trình của tôi hay không." },
  { path: "/portal/goals/[goalId]", areaKey: null },
  { path: "/portal/goals/new", areaKey: null },
  { path: "/portal/hanh-trinh-cua-toi", areaKey: "hanhtrinh", note: "Route chết — next.config.ts redirect 301 sang /portal/hanhtrinhcuatoi, page.tsx không thể render." },
  { path: "/portal/hanhtrinhcuatoi", areaKey: "hanhtrinh" },
  { path: "/portal/hanhtrinhcuatoi/ban-do", areaKey: "hanhtrinh" },
  { path: "/portal/hetrithucai", areaKey: null, note: "⚠️ Trùng tên khái niệm với CKOS (\"Hệ tri thức AI\") nhưng route khác /portal/ckos — chưa xác nhận vai trò/quan hệ giữa 2 route này." },
  { path: "/portal/hetrithucai/[slug]", areaKey: null, note: "Xem ghi chú /portal/hetrithucai." },
  { path: "/portal/hetrithucai/collection/[slug]", areaKey: null, note: "Xem ghi chú /portal/hetrithucai." },
  { path: "/portal/hocvienai", areaKey: "hocvienai" },
  { path: "/portal/khuvuoncuaban", areaKey: "hanhtrinh" },
  { path: "/portal/mirror", areaKey: "hanhtrinh" },
  { path: "/portal/my-products", areaKey: null },
  { path: "/portal/nhatkyhoctap", areaKey: "hanhtrinh" },
  { path: "/portal/origin", areaKey: null },
  { path: "/portal/personal-brand", areaKey: null },
  { path: "/portal/practice", areaKey: null },
  { path: "/portal/premium", areaKey: "premium" },
  { path: "/portal/prompts", areaKey: null },
  { path: "/portal/prompts/[id]", areaKey: null },
  { path: "/portal/referral", areaKey: null },
  { path: "/portal/resources", areaKey: null },
  { path: "/portal/resources/[id]", areaKey: null },
  { path: "/portal/roadmap", areaKey: null },
  { path: "/portal/saved", areaKey: null },
  { path: "/portal/services", areaKey: null },
  { path: "/portal/sop", areaKey: null },
  { path: "/portal/start-here", areaKey: null },
  { path: "/portal/story", areaKey: "hanhtrinh" },
  { path: "/portal/student-success", areaKey: "congdongai", note: "Route chết — đã xác nhận ADM-SPR-005, next.config.ts redirect 301 sang /portal/congdongai." },
  { path: "/portal/su-menh-companion", areaKey: "su-menh-companion" },
  { path: "/portal/su-menh-companion/companion-qua-hinh-anh", areaKey: "su-menh-companion" },
  { path: "/portal/support", areaKey: null },
  { path: "/portal/templates", areaKey: null },
  { path: "/portal/tools", areaKey: null },
  { path: "/portal/tools/[id]", areaKey: null },
  { path: "/portal/updates", areaKey: "congdongai", note: "Route chết — đã xác nhận ADM-SPR-005, next.config.ts redirect 301 sang /portal/congdongai#tin-tuc." },
  { path: "/portal/vdai-academy", areaKey: null },
  { path: "/portal/workspace", areaKey: null },
];

export const UNMAPPED_PAGE_COUNT = PORTAL_PAGES.filter((p) => p.areaKey === null).length;
