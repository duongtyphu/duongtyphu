"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COMPANION_ARTWORK_SEQUENCE } from "@/lib/companion-world/artwork-pages";

/**
 * Companion World™ — "Companion qua hình ảnh". Story Book, không phải
 * landing page/dashboard/gallery: gộp toàn bộ 7 artwork đã duyệt thành
 * MỘT trang duy nhất, hiển thị lần lượt — không hotspot, không CTA giữa
 * chừng, không chapter nav/sidebar phụ. Người dùng chỉ cuộn.
 *
 * Story Book Experience — mỗi artwork là "một chương mới" xuất hiện khi
 * cuộn tới: fade + dịch nhẹ + scale rất nhỏ (parallax rất nhẹ, không phải
 * parallax theo scroll bằng JS), khoảng nghỉ 64px giữa các artwork, shadow
 * rất mờ quanh mỗi trang, một dải sáng mờ ở điểm nối giữa hai artwork.
 * Không page-flip 3D, không thư viện lật sách, không animation nặng.
 */
export function CompanionThroughImages() {
  return (
    <div className="relative -mx-4 -my-6 min-h-screen overflow-x-hidden bg-[#010425] md:-mx-8 md:-my-8">
      <Link href="/portal/companion" className="companion-artwork-back" style={{ zIndex: 30 }}>
        ← Quay lại Companion
      </Link>

      <div className="flex flex-col pb-24 pt-20 sm:pt-24">
        {COMPANION_ARTWORK_SEQUENCE.map((artwork, i) => (
          <div key={artwork.id} className={i === 0 ? "relative" : "companion-story-seam relative mt-16"}>
            <motion.div
              className="companion-story-page"
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={artwork.src}
                alt={artwork.title}
                width={artwork.width}
                height={artwork.height}
                sizes="100vw"
                className="block h-auto w-full"
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
