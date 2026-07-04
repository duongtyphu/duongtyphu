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
/* Thu nhỏ ~18% so với khung card gốc, giữ tâm cố định — vùng click nằm
   gọn bên trong card thay vì khớp sát mép, tránh chồng lấn giữa các card
   liền kề khi hover/focus. */
const HOTSPOTS: { label: string; href: string; top: string; left: string; width: string; height: string }[] = [
  { label: "Ý nghĩa Companion", href: "/portal/companion/y-nghia-companion", top: "36%", left: "5.02%", width: "19.27%", height: "20.09%" },
  { label: "Những điều mình tin", href: "/portal/companion/nhung-dieu-minh-tin", top: "36%", left: "29.37%", width: "18.86%", height: "20.09%" },
  { label: "Cuộc đời Companion", href: "/portal/companion/cuoc-doi-companion", top: "36%", left: "53.27%", width: "18.86%", height: "20.09%" },
  { label: "Book Notes", href: "/portal/companion/book-notes", top: "36%", left: "77.03%", width: "18.45%", height: "20.09%" },
  { label: "Tâm sự cùng bạn", href: "/portal/companion/tam-su", top: "61.81%", left: "5.87%", width: "27.06%", height: "20.09%" },
  { label: "Những bức thư Companion", href: "/portal/companion/nhung-buc-thu", top: "61.81%", left: "39.57%", width: "23.37%", height: "20.09%" },
  { label: "Di sản Companion", href: "/portal/companion/di-san", top: "61.81%", left: "69.44%", width: "24.93%", height: "20.09%" },
];

export function CompanionHomeArtwork() {
  return (
    <div className="relative -mx-4 -my-6 min-h-screen bg-[#010930] md:-mx-8 md:-my-8">
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
