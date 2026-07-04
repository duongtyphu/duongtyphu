"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COMPANION_ARTWORK_SEQUENCE } from "@/lib/companion-world/artwork-pages";

/** Biến thể lật trang — rotateY dương/âm tuỳ hướng lật, theo đúng pattern
    "custom" chính thức của framer-motion cho carousel/lật trang. */
const pageVariants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 78 : -78, opacity: 0.25 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? -78 : 78, opacity: 0.25 }),
};

/** Fallback cho prefers-reduced-motion/thiết bị yếu — crossfade đơn giản,
    không rotateY/3D, vẫn giữ khung sách nguyên vẹn. */
const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Companion World™ — "Companion qua hình ảnh" là một cuốn sách 3D thật,
 * không phải gallery/scroll page. Mỗi artwork là một trang, lật bằng CSS
 * 3D transform (rotateY qua framer-motion — đã là dependency sẵn có,
 * không thêm thư viện flipbook mới vì các lib đó (react-pageflip,
 * react-pageflip-2...) đều dựa vào API class-component cũ, không an toàn
 * với React 19 dùng trong project này).
 *
 * Không crop/méo ảnh: mỗi trang là một khung cố định tỉ lệ, ảnh nằm giữa
 * bằng `object-fit: contain` (next/image `fill`), giữ nguyên toàn bộ nội
 * dung dù ảnh portrait hay landscape.
 */
export function CompanionFlipbook() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = COMPANION_ARTWORK_SEQUENCE.length;
  const page = COMPANION_ARTWORK_SEQUENCE[index];
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? fadeVariants : pageVariants;

  useEffect(() => {
    // Preload trang thứ 2 ngay khi vào sách — trang 1 đã ưu tiên qua
    // `priority` bên dưới, đúng yêu cầu "preload 2 artwork đầu tiên".
    if (total > 1) {
      const preload = new window.Image();
      preload.src = COMPANION_ARTWORK_SEQUENCE[1].src;
    }
  }, [total]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function goNext() {
    setDirection(1);
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function goPrev() {
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="companion-flipbook-stage relative -mx-4 -my-6 flex min-h-screen flex-col items-center overflow-x-hidden bg-[#010425] px-4 py-16 md:-mx-8 md:-my-8 sm:py-20">
      <Link href="/portal/companion" className="companion-artwork-back" style={{ zIndex: 30 }}>
        ← Quay lại Companion
      </Link>

      {/* Khung sách — bìa/khung tối, bóng đổ mềm, chiều sâu 3D qua perspective. */}
      <div className="companion-flipbook-frame relative flex w-full max-w-[1080px] flex-col items-center">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) goNext();
            else if (info.offset.x > 60) goPrev();
          }}
          className="companion-flipbook-page relative w-full"
          style={{ perspective: 1800 }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: prefersReducedMotion ? 0.25 : 0.55, ease: [0.45, 0, 0.55, 1] }}
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      transformStyle: "preserve-3d",
                      transformOrigin: direction > 0 ? "left center" : "right center",
                    }
              }
              className="companion-flipbook-leaf relative aspect-[4/5] w-full sm:aspect-[16/10]"
            >
              <Image
                src={page.src}
                alt={page.title}
                fill
                sizes="(min-width: 640px) 1080px, 100vw"
                className="object-contain p-3 sm:p-6"
                priority={index <= 1}
                loading={index <= 1 ? undefined : "lazy"}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Controls — Prev / Next / page indicator / chapter title. */}
        <div className="mt-6 flex w-full items-center justify-between gap-4 sm:mt-8">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Trang trước"
            className="companion-flipbook-nav"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
              Trang {index + 1} / {total}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-100 sm:text-base">{page.title}</p>
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={index === total - 1}
            aria-label="Trang sau"
            className="companion-flipbook-nav"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
