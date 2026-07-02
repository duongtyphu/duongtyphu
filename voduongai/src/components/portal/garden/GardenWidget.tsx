import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gardenStats } from "@/data/portal/knowledge-garden";
import { GardenTreeVisual } from "@/components/portal/garden/GardenTreeVisual";

/**
 * Preview nhỏ của "Khu vườn của bạn" ở trang chủ Portal — chỉ tóm tắt,
 * không render toàn bộ cây lớn + lá hành động. Click dẫn tới trang
 * chi tiết /portal/khu-vuon-cua-ban.
 */
export function GardenWidget() {
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
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          Mỗi hành động là một chiếc lá — vườn của bạn đang ở cấp{" "}
          <span className="font-semibold text-green-600">{gardenStats.gardenLevel}</span>.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center sm:grid-cols-3">
          <div>
            <p className="text-base font-extrabold text-gray-900">{gardenStats.totalLeaves}</p>
            <p className="text-[11px] text-gray-400">Lá đã gieo</p>
          </div>
          <div>
            <p className="text-base font-extrabold text-gray-900">{gardenStats.totalHours}h</p>
            <p className="text-[11px] text-gray-400">Thời gian học</p>
          </div>
          <div>
            <p className="text-base font-extrabold text-gray-900">{gardenStats.streakDays}</p>
            <p className="text-[11px] text-gray-400">Ngày liên tiếp</p>
          </div>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
          Xem khu vườn <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
      <div className="hidden sm:block">
        <GardenTreeVisual compact />
      </div>
    </Link>
  );
}
