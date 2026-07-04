import { CompanionOrb } from "./CompanionOrb";

/**
 * Companion Design System™ — Layer 02, Nhiệm vụ 04 + Sprint CW-001.1,
 * Nhiệm vụ VIII: mini Companion Orb ở cuối sidebar khi đang ở trong thế
 * giới Companion. Cùng một Companion Character (CompanionOrb → LivingCore),
 * chỉ nhỏ hơn và dịu hơn — không mascot mới, không quá nổi bật.
 *
 * "Góc hiện diện", không phải banner quảng cáo: dùng glass + glow rất mềm
 * (cùng ngôn ngữ companion-glow-panel) thay vì border/nền phẳng, để đây
 * đọc như một nơi Companion đang lặng lẽ ở đó, không phải một CTA.
 */
export function CompanionSidebarOrb({ showLabel }: { showLabel: boolean }) {
  return (
    <div
      className={`companion-sidebar-presence mt-6 flex items-center gap-2.5 rounded-xl px-3 py-3 ${
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
