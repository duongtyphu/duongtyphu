import { CompanionArtworkPage } from "@/components/portal/companion/CompanionArtworkPage";
import { COMPANION_ARTWORK_PAGES } from "@/lib/companion-world/artwork-pages";

const ARTWORK = COMPANION_ARTWORK_PAGES["nhung-buc-thu"];

export const metadata = { title: ARTWORK.title };

/**
 * Companion World™ — Artwork Final. Trang này chỉ hiển thị artwork đã
 * duyệt "Những bức thư Companion".
 */
export default function NhungBucThuPage() {
  return <CompanionArtworkPage src={ARTWORK.src} alt={ARTWORK.title} width={ARTWORK.width} height={ARTWORK.height} />;
}
