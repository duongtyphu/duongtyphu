import { CompanionHomeArtwork } from "@/components/portal/companion/CompanionHomeArtwork";

export const metadata = { title: "Companion — VO DUONG AI" };

/**
 * Companion World™ — Artwork Final (thay thế toàn bộ layout component cũ
 * của Companion Home). Trang chủ giờ là MỘT artwork đã duyệt, có các vùng
 * click dẫn tới 7 trang con — không dựng lại UI bằng nhiều section/card,
 * không Companion Orb động, không animation phức tạp. Xem
 * `CompanionHomeArtwork` cho vị trí 7 vùng click.
 */
export default function CompanionHomePage() {
  return <CompanionHomeArtwork />;
}
