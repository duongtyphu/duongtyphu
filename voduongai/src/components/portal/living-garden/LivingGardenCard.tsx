import { Sparkles } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import {
  buildGardenState,
  type GardenInputs,
  type GardenElementKey,
} from "@/lib/portal/living-garden/garden-model";

/**
 * Living Garden Card (Sprint 9.0 — Nhiệm vụ 03/04). Visualization of
 * Growth — không phải progress bar, không phải bảng điểm. Xem
 * `docs/LIVING_GARDEN.md` cho triết lý đầy đủ. Tuyệt đối không hiển
 * thị số điểm/% ra UI — chỉ trạng thái bằng chữ + hình ảnh trừu tượng.
 */

const ELEMENT_ORDER: GardenElementKey[] = [
  "roots",
  "leaves",
  "branches",
  "flowers",
  "light",
  "water",
  "gems",
];

function GardenVisual({ intensity, compact = false }: { intensity: number; compact?: boolean }) {
  const nodeCount = Math.max(2, Math.min(7, Math.round(2 + intensity * 5)));

  return (
    <div
      className={`living-garden-visual relative flex items-end justify-center overflow-hidden rounded-2xl border border-[#1E3A8A]/30 bg-gradient-to-br from-[#0B1F4D] via-[#1E3A8A] to-[#5B21B6] ${
        compact ? "h-24" : "h-36 sm:h-44"
      }`}
      aria-hidden="true"
    >
      <div className="living-garden-glow absolute inset-0" style={{ "--garden-glow-intensity": intensity } as React.CSSProperties} />

      <div className="relative flex h-full w-full items-end justify-center pb-3">
        <div className="living-garden-stem relative h-[70%] w-px bg-gradient-to-t from-[#2563EB]/70 via-[#7C3AED]/50 to-transparent">
          {Array.from({ length: nodeCount }).map((_, i) => {
            const offsetBottom = 14 + i * (60 / nodeCount);
            const side = i % 2 === 0 ? 1 : -1;
            const size = compact ? 7 : 9;
            return (
              <span
                key={i}
                className="living-garden-node absolute rounded-full"
                style={{
                  bottom: `${offsetBottom}%`,
                  left: `${side * (6 + i * 2)}px`,
                  width: size,
                  height: size,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            );
          })}
        </div>
        <span className="living-garden-seed absolute bottom-0 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-400 to-violet-500" />
      </div>
    </div>
  );
}

export function LivingGardenCard({
  inputs,
  compact = false,
  className = "",
}: {
  inputs: GardenInputs;
  compact?: boolean;
  className?: string;
}) {
  const garden = buildGardenState(inputs);

  if (garden.isEmpty) {
    return (
      <GemCard className={`relative ${className}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-400" />
          <h2 className="gemos-card-title text-sm font-bold text-blue-700">Khu vườn của bạn</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Khu vườn của bạn đang chờ hạt giống đầu tiên.
        </p>
        <p className="mt-1 text-xs text-violet-600/70">
          Mỗi hành động nhỏ hôm nay là một hạt giống cho phiên bản tốt hơn của bạn ngày mai.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/portal/story" variant="primary" className="!w-auto">
            Viết Reflection đầu tiên
          </Button>
          <Button href="/portal/journey" variant="secondary" className="!w-auto">
            Bắt đầu hành trình
          </Button>
        </div>
        <p className="mt-4 text-xs text-gray-400">Companion đang chăm sóc khu vườn này cùng bạn.</p>
      </GemCard>
    );
  }

  return (
    <GemCard className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-orange-400" />
        <h2 className="gemos-card-title text-sm font-bold text-blue-700">Khu vườn của bạn</h2>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        Khu vườn của bạn đang lớn lên từ những bước nhỏ.
      </p>
      {!compact && (
        <>
          <p className="mt-1 text-xs text-violet-600/70">
            Mỗi hành động hôm nay là một hạt giống cho phiên bản tốt hơn của bạn ngày mai.
          </p>
          <p className="mt-1 text-xs italic text-gray-400">
            Hình ảnh của 8 giai đoạn mài giũa — không phải điểm số.
          </p>
        </>
      )}

      <div className="mt-4">
        <GardenVisual intensity={Math.max(...garden.elements.map((e) => e.intensity))} compact={compact} />
      </div>

      <p className="mt-3 text-sm font-semibold text-blue-700">{garden.headline}</p>

      {!compact && (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500 sm:grid-cols-1">
          {ELEMENT_ORDER.map((key) => {
            const el = garden.elements.find((e) => e.key === key)!;
            return (
              <li key={key} className="flex items-baseline gap-1.5">
                <span className="font-semibold text-orange-600">{el.label}</span>
                <span className="text-gray-400">·</span>
                <span>{el.meaning}</span>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-gray-400">Companion đang chăm sóc khu vườn này cùng bạn.</p>
    </GemCard>
  );
}
