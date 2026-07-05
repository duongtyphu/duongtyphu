import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { gardenStats } from "@/data/portal/knowledge-garden";

/**
 * Preview nhỏ của "Khu vườn của bạn" ở trang chủ Portal — dùng đúng
 * ảnh cây thật (Official Tree Asset) và nền trắng ngọc pha nắng ấm
 * giống hệt trang chi tiết /portal/khuvuoncuaban, thay vì cây vẽ
 * bằng CSS blob tách biệt hoàn toàn về hình ảnh với trang gốc. Vẫn
 * chỉ là bản tóm tắt (cây nhỏ + Lv. hiện tại + tổng lá + % đến giai
 * đoạn tiếp theo + CTA) — không render leaf chip tương tác hay
 * animation phức tạp của trang đầy đủ.
 */
export function GardenWidget() {
  return (
    <Link
      href="/portal/khuvuoncuaban"
      className="garden-widget-card gemos-gem-card group grid gap-4 overflow-hidden rounded-2xl p-0 sm:grid-cols-[minmax(0,1fr)_11rem]"
    >
      <div className="relative p-5 sm:p-6">
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

      <div className="garden-scene relative hidden h-40 overflow-hidden sm:block">
        <Image
          src="/images/garden/garden-tree-scene.jpg"
          alt="Cây tri thức trong khu vườn của bạn"
          fill
          sizes="176px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="garden-sunray-live" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="garden-widget-leaf absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-green-600 shadow-sm backdrop-blur-sm"
        >
          <Leaf className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
