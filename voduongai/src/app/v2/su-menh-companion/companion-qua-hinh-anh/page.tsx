import { CompanionFlipbook } from "@/components/portal/companion/CompanionFlipbook";

export const metadata = { title: "Companion qua hình ảnh — Companion" };

/**
 * `/v2/su-menh-companion/companion-qua-hinh-anh` — Founder yêu cầu (đợt
 * "di chuyển sang portal 2.0"): nút "Companion qua hình ảnh →" ở cuối
 * `/v2/su-menh-companion` KHÔNG được link qua bản 1.0 nữa (trước đây trỏ
 * `/portal/su-menh-companion/companion-qua-hinh-anh`).
 *
 * Tái dùng NGUYÊN `<CompanionFlipbook/>` (Single Source of Truth — 7 trang
 * artwork thật, đọc live qua `companion_flipbook_pages`, không copy lại) —
 * chỉ đổi `backHref` (mới thêm, mặc định giữ `/portal/companion` cho bản
 * 1.0 không đổi hành vi) sang `/v2/su-menh-companion`.
 *
 * CỐ Ý KHÔNG bọc `PortalV2Shell` (khác mọi trang `/v2/*` khác): component
 * này vốn đã là trải nghiệm "cuốn sách" toàn màn hình
 * (`min-h-screen bg-[#010425]`, âm margin để thoát padding của Shell 1.0)
 * — bọc thêm sidebar/topbar 2.0 sẽ đè lệch layout full-bleed đã thiết kế
 * sẵn (thang spacing Tailwind `-mx-4/-my-6` của 1.0 không khớp
 * `.content{padding:24px 28px}` của 2.0). Đây là trang "nghệ thuật", không
 * phải trang nội dung CMS thường — nút back tự đưa về đúng
 * `/v2/su-menh-companion` là đủ để không còn rơi ngược lại 1.0.
 */
export default function CompanionQuaHinhAnhV2Page() {
  return <CompanionFlipbook backHref="/v2/su-menh-companion" />;
}
