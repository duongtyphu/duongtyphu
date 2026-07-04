import { CompanionArtworkPage } from "@/components/portal/companion/CompanionArtworkPage";
import { COMPANION_ARTWORK_PAGES } from "@/lib/companion-world/artwork-pages";

const ARTWORK = COMPANION_ARTWORK_PAGES["book-notes"];

export const metadata = { title: ARTWORK.title };

/**
 * Companion World™ — Artwork Final. Trang này chỉ hiển thị artwork đã
 * duyệt, không dựng lại bằng component/card riêng nữa.
 */
export default function BookNotesPage() {
  return <CompanionArtworkPage src={ARTWORK.src} alt={ARTWORK.title} width={ARTWORK.width} height={ARTWORK.height} />;
}
