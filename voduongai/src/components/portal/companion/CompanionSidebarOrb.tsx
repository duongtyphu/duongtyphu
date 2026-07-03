import { LivingCore } from "@/components/LivingCore";

/**
 * Companion Design System™ — Layer 01, Bước 5: mini Companion Orb area ở
 * cuối sidebar khi đang ở trong thế giới Companion. Tái dùng LivingCore đã
 * có (không tạo mascot/SVG mới).
 */
export function CompanionSidebarOrb({ showLabel }: { showLabel: boolean }) {
  return (
    <div
      className={`mt-6 flex items-center gap-2.5 rounded-xl border border-violet-400/15 bg-white/5 px-3 py-3 ${
        showLabel ? "" : "justify-center"
      }`}
    >
      <LivingCore size={32} state="idle" />
      {showLabel && (
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-slate-100">Companion</p>
          <p className="truncate text-[10px] text-slate-400">Luôn ở đây cùng bạn</p>
        </div>
      )}
    </div>
  );
}
