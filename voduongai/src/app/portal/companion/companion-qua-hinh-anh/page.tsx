import { CompanionThroughImages } from "@/components/portal/companion/CompanionThroughImages";

export const metadata = { title: "Companion qua hình ảnh — Companion" };

/**
 * Companion World™ — gộp 7 artwork đã duyệt (trước đây là 7 trang riêng)
 * thành một trang duy nhất, hiển thị lần lượt: Xin chào mình là Companion
 * → Những điều mình tin → Cuộc đời Companion → Book Notes → Tâm sự cùng
 * bạn → Những bức thư Companion → Di sản Companion.
 */
export default function CompanionQuaHinhAnhPage() {
  return <CompanionThroughImages />;
}
