import { CompanionFlipbook } from "@/components/portal/companion/CompanionFlipbook";

export const metadata = { title: "Companion qua hình ảnh — Companion" };

/**
 * Companion World™ — một cuốn sách 3D thật (flipbook), không phải
 * gallery/scroll page: 7 artwork đã duyệt, mỗi artwork là một trang, lật
 * bằng CSS 3D transform. Thứ tự: Xin chào mình là Companion → Những điều
 * mình tin → Cuộc đời Companion → Book Notes → Tâm sự cùng bạn → Những
 * bức thư Companion → Di sản Companion.
 */
export default function CompanionQuaHinhAnhPage() {
  return <CompanionFlipbook />;
}
