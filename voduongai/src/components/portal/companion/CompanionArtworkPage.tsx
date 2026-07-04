import Image from "next/image";
import Link from "next/link";

/**
 * Companion World™ — Artwork Final. Trang con chỉ hiển thị MỘT artwork đã
 * duyệt — ảnh là NỀN của vùng content, khít edge-to-edge, không khoảng
 * trắng/padding nào quanh ảnh. Không sidebar/header trong ảnh, không chữ
 * đè lên ảnh (trừ nút "Quay lại Companion" nổi ở góc). `width`/`height` là
 * kích thước gốc thật của ảnh để next/image giữ đúng tỉ lệ, không crop/méo.
 * Lazy load mặc định (không set `priority`) — chỉ Companion Home mới
 * preload, các trang con chỉ tải khi được điều hướng tới.
 */
export function CompanionArtworkPage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="relative -mx-4 -my-6 min-h-screen overflow-x-hidden bg-[#010425] md:-mx-8 md:-my-8">
      <div className="relative w-full">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="100vw"
          className="block h-auto w-full"
          loading="lazy"
        />

        <Link href="/portal/companion" className="companion-artwork-back">
          ← Quay lại Companion
        </Link>
      </div>
    </div>
  );
}
