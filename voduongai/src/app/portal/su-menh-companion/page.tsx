"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import { SuMenhCompanionContent } from "./SuMenhCompanionContent";

/**
 * `/portal/su-menh-companion` (1.0) — CHỈ còn giữ phần CHROME riêng của
 * bản 1.0 (nền `SanctuaryBackground` full-bleed + hiệu ứng intro "Chào
 * mừng bạn trở về" 1.3s). Toàn bộ NỘI DUNG (Hero/Living Core demo/10
 * section triết lý/CTA/footer, 6 khối live-edit) đã tách sang
 * `SuMenhCompanionContent.tsx` — dùng chung với `/v2/su-menh-companion`
 * (bọc `PortalV2Shell` thay vì `SanctuaryBackground`) để sửa nội dung 1
 * lần, phản ánh cả 2 nơi.
 */
export default function CompanionHomePage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <SanctuaryBackground />

      {/* ═══════════════════ INTRO MOMENT — 1.3s, không chặn tương tác ═══════════════════ */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.p
              className="text-lg font-medium text-gray-500"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Chào mừng bạn trở về.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <SuMenhCompanionContent />
    </div>
  );
}
