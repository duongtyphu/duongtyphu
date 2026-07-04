import Image from "next/image";
import Link from "next/link";
import { COMPANION_HOME_ARTWORK } from "@/lib/companion-world/artwork-pages";

/**
 * Companion World™ — Artwork Final, Companion Home. Artwork đã duyệt là
 * nội dung trung tâm — Claude Code chỉ gắn vùng click vô hình đúng vị trí
 * 7 khối trên ảnh, không dựng lại UI bằng component/card riêng, không có
 * Companion Orb động, không animation phức tạp.
 *
 * Toạ độ % dưới đây ước lượng theo đúng vị trí 7 khối trong artwork gốc
 * (1024×1536) — vì ảnh luôn giữ nguyên tỉ lệ (không `fill`/không crop),
 * % top/left/width/height khớp đúng vị trí ở mọi kích thước màn hình.
 */
const HOTSPOTS: { label: string; href: string; top: string; left: string; width: string; height: string }[] = [
  { label: "Ý nghĩa Companion", href: "/portal/companion/y-nghia-companion", top: "33.8%", left: "2.9%", width: "23.5%", height: "24.5%" },
  { label: "Những điều mình tin", href: "/portal/companion/nhung-dieu-minh-tin", top: "33.8%", left: "27.3%", width: "23%", height: "24.5%" },
  { label: "Cuộc đời Companion", href: "/portal/companion/cuoc-doi-companion", top: "33.8%", left: "51.2%", width: "23%", height: "24.5%" },
  { label: "Book Notes", href: "/portal/companion/book-notes", top: "33.8%", left: "75%", width: "22.5%", height: "24.5%" },
  { label: "Tâm sự cùng bạn", href: "/portal/companion/tam-su", top: "59.6%", left: "2.9%", width: "33%", height: "24.5%" },
  { label: "Những bức thư Companion", href: "/portal/companion/nhung-buc-thu", top: "59.6%", left: "37%", width: "28.5%", height: "24.5%" },
  { label: "Di sản Companion", href: "/portal/companion/di-san", top: "59.6%", left: "66.7%", width: "30.4%", height: "24.5%" },
];

export function CompanionHomeArtwork() {
  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      {/* Artwork là nền của vùng content — khít edge-to-edge, không
          padding/khoảng trắng nào quanh ảnh. */}
      <div className="relative">
        <Image
          src={COMPANION_HOME_ARTWORK.src}
          alt="Companion World — Xin chào, mình là Companion"
          width={COMPANION_HOME_ARTWORK.width}
          height={COMPANION_HOME_ARTWORK.height}
          sizes="100vw"
          className="block h-auto w-full"
          priority
        />

        {/* Vùng click vô hình — khớp đúng vị trí 7 khối trên artwork. */}
        {HOTSPOTS.map((spot) => (
          <Link
            key={spot.href}
            href={spot.href}
            aria-label={spot.label}
            className="companion-artwork-hotspot absolute"
            style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
          />
        ))}
      </div>

      {/* Không có vùng riêng cho "Không gian AI" trên artwork — dùng nút
          thật bên dưới, theo đúng chỉ dẫn "vùng click vô hình HOẶC nút
          thật". Chỉ khoảng chứa riêng nút này có padding, không phải ảnh. */}
      <div className="flex justify-center px-4 py-6">
        <Link href="/portal/khong-gian-ai" className="companion-artwork-cta">
          Bước vào Không gian AI →
        </Link>
      </div>
    </div>
  );
}
