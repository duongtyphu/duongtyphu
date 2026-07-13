"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { getGardenSummary, type GardenSummary } from "@/lib/portal/foundation/growth-view";

/**
 * Preview nhỏ của "Khu vườn của bạn" ở trang chủ Portal.
 *
 * Portal 4.0 Content Reconstruction: trước đây dùng `gardenStats` tĩnh (Lv.
 * cố định, % lên cấp giả). Đổi sang dữ liệu thật từ `growth-view.ts` — cùng
 * nguồn duy nhất với trang chi tiết `/portal/khuvuoncuaban` (xem
 * PORTAL_CONTENT_RECONSTRUCTION_PLAN.md mục B.3/B.7).
 */
export function GardenWidget() {
  const [garden, setGarden] = useState<GardenSummary | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGarden(getGardenSummary());
  }, []);

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
        {garden && garden.totalOutputs > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-base font-extrabold text-gray-900">{garden.missionsCompleted}</p>
              <p className="text-[11px] text-gray-400">Nhiệm vụ hoàn thành</p>
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900">{garden.totalOutputs}</p>
              <p className="text-[11px] text-gray-400">Kết quả đã tạo</p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-xs text-gray-400">Khu vườn còn trống — hoàn thành một Nhiệm vụ để bắt đầu.</p>
        )}
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
