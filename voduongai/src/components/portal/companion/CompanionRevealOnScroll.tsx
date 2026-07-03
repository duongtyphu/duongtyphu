"use client";

/**
 * Companion Design System™ — Layer 03: Scroll Experience (Nhiệm vụ 04).
 * Wrapper tái dùng cho hiệu ứng cuộn — không thêm nội dung/section, chỉ đổi
 * CÁCH một khối đã có xuất hiện khi cuộn tới. Dùng Framer Motion (đã ổn
 * định trong project) thay vì tự viết IntersectionObserver.
 */

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import type { ReactNode } from "react";

export type CompanionRevealVariant = "fade-up" | "float" | "slide" | "fade" | "glow";

const VARIANTS: Record<CompanionRevealVariant, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  "fade-up": { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } },
  float: { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } },
  slide: { hidden: { opacity: 0, x: 16 }, visible: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  glow: { hidden: { opacity: 0, filter: "brightness(0.7)" }, visible: { opacity: 1, filter: "brightness(1)" } },
};

export function CompanionRevealOnScroll({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  variant?: CompanionRevealVariant;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { hidden, visible } = VARIANTS[variant];

  if (reduceMotion) {
    // Vẫn đẹp, chỉ không chuyển động — hiện luôn ở trạng thái cuối.
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
