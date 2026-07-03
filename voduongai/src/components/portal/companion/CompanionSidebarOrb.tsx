import { CompanionOrb } from "./CompanionOrb";

/**
 * Companion Design System™ — Layer 02, Nhiệm vụ 04: mini Companion Orb ở
 * cuối sidebar khi đang ở trong thế giới Companion. Cùng một Companion
 * Character (CompanionOrb → LivingCore), chỉ nhỏ hơn và dịu hơn — không
 * mascot mới, không quá nổi bật, không chiếm nhiều diện tích.
 */
export function CompanionSidebarOrb({ showLabel }: { showLabel: boolean }) {
  return (
    <div
      className={`mt-6 flex items-center gap-2.5 rounded-xl border border-violet-400/15 bg-white/5 px-3 py-3 ${
        showLabel ? "" : "justify-center"
      }`}
    >
      <CompanionOrb size="sm" state="idle" intensity="calm" showOrbit={false} />
      {showLabel && (
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-slate-100">Companion</p>
          <p className="truncate text-[10px] text-slate-400">Mình luôn ở đây để đồng hành.</p>
        </div>
      )}
    </div>
  );
}
