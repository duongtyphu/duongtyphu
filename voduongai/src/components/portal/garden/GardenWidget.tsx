import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gardenStats, getGrowthStage } from "@/data/portal/knowledge-garden";
import { GardenTreeVisual } from "@/components/portal/garden/GardenTreeVisual";

/**
 * Preview nhỏ của "Khu vườn của bạn" ở trang chủ Portal — chỉ tóm tắt
 * (cây nhỏ + Lv. hiện tại + tổng lá + % đến giai đoạn tiếp theo + CTA),
 * không render toàn bộ cây lớn + lá hành động. Click dẫn tới trang
 * chi tiết /portal/khu-vuon-cua-ban.
 */
export function GardenWidget() {
  const { index } = getGrowthStage(gardenStats.totalLeaves);

  return (
    <Link
      href="/portal/khu-vuon-cua-ban"
      className="gemos-gem-card group grid gap-4 overflow-hidden rounded-2xl p-0 sm:grid-cols-[minmax(0,1fr)_11rem]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h2 className="gemos-card-title text-sm font-bold text-gray-900">Khu vườn của bạn</h2>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-900">
          🌳 Lv. {gardenStats.level} · {gardenStats.tierName}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-base font-extrabold text-gray-900">{gardenStats.totalLeaves}</p>
            <p className="text-[11px] text-gray-400">Chiếc lá</p>
          </div>
          <div>
            <p className="text-base font-extrabold text-gray-900">{gardenStats.percentToNextLevel}%</p>
            <p className="text-[11px] text-gray-400">Đang lớn lên</p>
          </div>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
          Xem khu vườn <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
      <div className="hidden sm:block">
        <GardenTreeVisual compact stageIndex={index} />
      </div>
    </Link>
  );
}
