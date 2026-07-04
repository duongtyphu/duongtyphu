import Image from "next/image";

/**
 * Companion World™ — Artwork Final. Trang con chỉ hiển thị MỘT artwork đã
 * duyệt, full width trong vùng content — không sidebar/header trong ảnh,
 * không chữ đè lên ảnh, không crop/méo. `width`/`height` là kích thước gốc
 * thật của ảnh để next/image giữ đúng tỉ lệ ở mọi breakpoint.
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
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-8">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 896px, 100vw"
          className="h-auto w-full rounded-2xl"
          priority
        />
      </div>
    </div>
  );
}
