export { default } from "@/app/portal/su-menh-companion/page";

export const metadata = { title: "Sứ mệnh Companion | VO DUONG AI" };

/**
 * `/v2/su-menh-companion` — theo yêu cầu Founder: lấy NGUYÊN trang
 * `/portal/su-menh-companion` (1.0) làm nội dung trang này, thay hẳn bản
 * mock tĩnh 2.0 trước đó (`SuMenhCompanionClient.tsx`, 1:1 từ
 * `Su menh Companion.html` — đã xoá).
 *
 * Import thẳng component gốc (không copy) — đúng nguyên tắc "Live-edit
 * Cách A" đã dùng xuyên suốt dự án (home-cards/duan-cohoi/5 Cửa Hành
 * trình...) để đảm bảo khớp byte-for-byte với 1.0 và tự động ăn theo mọi
 * thay đổi nội dung sau này (6 collection Supabase live-edited qua
 * `/admin/su-menh-companion/live-edit`), không lệch bản sao.
 *
 * Khác MỌI trang `/v2/*` khác: trang này KHÔNG có `PortalV2Shell`
 * (sidebar/topbar 2.0) — 1.0's `CompanionHomePage` là trải nghiệm
 * full-bleed riêng (`SanctuaryBackground`/`LivingCore`...), không có
 * shell nào bọc. Đây là quyết định lấy "nguyên" nội dung 1.0 theo đúng
 * yêu cầu, không tự ý ép vào khung 2.0.
 */
