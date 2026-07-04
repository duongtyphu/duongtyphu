import Image from "next/image";
import Link from "next/link";
import { COMPANION_ARTWORK_SEQUENCE } from "@/lib/companion-world/artwork-pages";

/**
 * Companion World™ — "Companion qua hình ảnh". Gộp toàn bộ 7 artwork đã
 * duyệt (trước đây là 7 trang riêng) thành MỘT trang duy nhất, hiển thị
 * lần lượt theo thứ tự — không hotspot, không CTA giữa chừng, chỉ cuộn
 * dọc qua từng artwork. Ảnh đầu tiên preload, các ảnh sau lazy load.
 */
export function CompanionThroughImages() {
  return (
    <div className="relative -mx-4 -my-6 min-h-screen overflow-x-hidden bg-[#010425] md:-mx-8 md:-my-8">
      <Link href="/portal/companion" className="companion-artwork-back" style={{ zIndex: 30 }}>
        ← Quay lại Companion
      </Link>

      <div className="flex flex-col">
        {COMPANION_ARTWORK_SEQUENCE.map((artwork, i) =>
          i === 0 ? (
            <Image
              key={artwork.id}
              src={artwork.src}
              alt={artwork.title}
              width={artwork.width}
              height={artwork.height}
              sizes="100vw"
              className="block h-auto w-full"
              priority
            />
          ) : (
            <Image
              key={artwork.id}
              src={artwork.src}
              alt={artwork.title}
              width={artwork.width}
              height={artwork.height}
              sizes="100vw"
              className="block h-auto w-full"
              loading="lazy"
            />
          ),
        )}
      </div>
    </div>
  );
}
