import Image from "next/image";
import { Sparkles, Leaf } from "lucide-react";
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
 *
 * Hình ảnh dùng đúng ảnh cây thật (Official Tree Asset) + nền trắng
 * ngọc pha nắng ấm — đồng bộ với /portal/khuvuoncuaban và widget
 * "Khu vườn của bạn" ở trang chủ, thay vì hình trừu tượng (thân cây
 * gradient + node phát sáng) tách biệt hoàn toàn về mặt thị giác.
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
  const leafCount = Math.max(1, Math.min(4, Math.round(1 + intensity * 3)));
  const leafSpots = [
    { top: "14%", right: "14%" },
    { top: "38%", right: "62%" },
    { top: "58%", right: "24%" },
    { top: "22%", right: "38%" },
  ].slice(0, leafCount);

  return (
    <div
      className={`garden-scene relative overflow-hidden rounded-2xl ${compact ? "h-24" : "h-36 sm:h-44"}`}
      aria-hidden="true"
    >
      <Image
        src="/images/garden/garden-tree-scene.jpg"
        alt=""
        fill
        sizes="320px"
        className="object-cover"
      />
      <div
        className="garden-sunray-live absolute inset-0"
        style={{ opacity: 0.5 + intensity * 0.5 }}
      />
      {leafSpots.map((spot, i) => (
        <span
          key={i}
          className="garden-widget-leaf absolute flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-green-600 shadow-sm backdrop-blur-sm"
          style={{ top: spot.top, right: spot.right, animationDelay: `${i * 0.7}s` }}
        >
          <Leaf className="h-3 w-3" />
        </span>
      ))}
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
      <GemCard className={`garden-widget-card relative ${className}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-400" />
          <h2 className="gemos-card-title text-base font-bold text-blue-700">Khu vườn của bạn</h2>
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
          <Button href="/portal/hanhtrinhcuatoi" variant="secondary" className="!w-auto">
            Bắt đầu hành trình
          </Button>
        </div>
        <p className="mt-4 text-xs text-gray-400">Companion đang chăm sóc khu vườn này cùng bạn.</p>
      </GemCard>
    );
  }

  return (
    <GemCard className={`garden-widget-card relative ${className}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-orange-400" />
        <h2 className="gemos-card-title text-base font-bold text-blue-700">Khu vườn của bạn</h2>
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
                <span className="font-semibold text-violet-600">{el.label}</span>
                <span className="text-gray-400">·</span>
                <span className="font-medium text-green-600">{el.meaning}</span>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-gray-400">Companion đang chăm sóc khu vườn này cùng bạn.</p>
    </GemCard>
  );
}
