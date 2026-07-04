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
 * (1536×1024) — vì ảnh luôn giữ nguyên tỉ lệ (không `fill`/không crop),
 * % top/left/width/height khớp đúng vị trí ở mọi kích thước màn hình.
 */
/* Thu nhỏ nhẹ ~8% so với khung card gốc, giữ tâm cố định — vùng click vừa
   khớp bên trong card (không chạm mép/chồng lấn card liền kề), bo góc để
   không lộ hình chữ nhật cứng khi hover/focus. */
const HOTSPOTS: { label: string; href: string; top: string; left: string; width: string; height: string }[] = [
  { label: "Ý nghĩa Companion", href: "/portal/companion/y-nghia-companion", top: "39.62%", left: "9.09%", width: "18.12%", height: "23.37%" },
  { label: "Những điều mình tin", href: "/portal/companion/nhung-dieu-minh-tin", top: "39.62%", left: "29.78%", width: "17.94%", height: "23.37%" },
  { label: "Cuộc đời Companion", href: "/portal/companion/cuoc-doi-companion", top: "39.62%", left: "50.09%", width: "18.12%", height: "23.37%" },
  { label: "Book Notes", href: "/portal/companion/book-notes", top: "39.62%", left: "70.78%", width: "17.94%", height: "23.37%" },
  { label: "Tâm sự cùng bạn", href: "/portal/companion/tam-su", top: "66.02%", left: "9.27%", width: "22.26%", height: "18.86%" },
  { label: "Những bức thư Companion", href: "/portal/companion/nhung-buc-thu", top: "66.02%", left: "34.52%", width: "23.37%", height: "18.86%" },
  { label: "Di sản Companion", href: "/portal/companion/di-san", top: "66.02%", left: "60.77%", width: "22.26%", height: "18.86%" },
];

export function CompanionHomeArtwork() {
  return (
    <div className="relative -mx-4 -my-6 min-h-screen overflow-x-hidden bg-[#010930] md:-mx-8 md:-my-8">
      {/* Artwork là nền của vùng content — khít edge-to-edge, không
          padding/khoảng trắng nào quanh ảnh. */}
      <div className="relative w-full">
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
            className="companion-artwork-hotspot absolute rounded-2xl"
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
