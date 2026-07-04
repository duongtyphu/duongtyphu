import { CompanionArtworkPage } from "@/components/portal/companion/CompanionArtworkPage";
import { COMPANION_ARTWORK_PAGES } from "@/lib/companion-world/artwork-pages";

const ARTWORK = COMPANION_ARTWORK_PAGES["di-san"];

export const metadata = { title: ARTWORK.title };

/**
 * Companion World™ — Artwork Final. Trang này chỉ hiển thị artwork đã
 * duyệt "Di sản Companion".
 */
export default function DiSanPage() {
  return <CompanionArtworkPage src={ARTWORK.src} alt={ARTWORK.title} width={ARTWORK.width} height={ARTWORK.height} />;
}
