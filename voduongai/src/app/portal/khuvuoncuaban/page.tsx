"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Leaf, Sun, Sprout, Heart, Quote } from "lucide-react";
import { GardenScene } from "@/components/portal/garden/scene/GardenScene";
import { GradientTitle } from "@/components/portal/ui/GradientTitle";
import { GrowthActivityPanel } from "@/components/portal/growth/GrowthActivityPanel";
import { GARDEN_CARE_TIP, CARE_SUGGESTIONS, GARDEN_FOOTER_QUOTE } from "@/data/portal/knowledge-garden";
import { getGardenSummary, getRecentActivity, type GardenSummary, type ActivityEntry } from "@/lib/portal/foundation/growth-view";

/**
 * Portal 4.0 Content Reconstruction — Journey Garden (nguồn duy nhất).
 *
 * Trước đây trang này có 2 hệ thống dữ liệu KHU VƯỜN chạy song song: (1)
 * `gardenStats`/`RECENT_ACTIVITIES` — 100% seed tĩnh (Lv. cố định, % lên cấp
 * cố định, "12 ngày liên tiếp" cố định — tự nhận trong code cũ là "seed data
 * mẫu"), và (2) `GrowthActivityPanel variant="garden"` — dữ liệu THẬT đọc từ
 * `growth-view.ts`. Cộng thêm 1 bản thứ 3 ở `/portal/story`
 * (`LivingGardenCard`). Theo PORTAL_CONTENT_RECONSTRUCTION_PLAN.md (mục
 * B.3/B.7): chỉ giữ 1 Garden — dùng đúng `growth-view.ts` làm nguồn duy
 * nhất, xoá mọi số liệu tĩnh giả. `GardenScene` (hình minh hoạ cây) giữ
 * nguyên vì đây là art trang trí, không phải số liệu.
 */

const CARE_ICONS = [Sun, Sprout, Heart];

export default function KnowledgeGardenPage() {
  const [garden, setGarden] = useState<GardenSummary | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    document.title = "Khu vườn của bạn — VO DUONG AI";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGarden(getGardenSummary());
    setActivity(getRecentActivity(5));
  }, []);

  const STATS = garden
    ? [
        { icon: Leaf, value: String(garden.missionsCompleted), label: "Nhiệm vụ hoàn thành" },
        { icon: Sprout, value: String(garden.journeysTouched), label: "Hành trình đã chạm" },
        { icon: Sun, value: String(garden.competenciesPracticed), label: "Kỹ năng đã thực hành" },
        { icon: Heart, value: String(garden.totalOutputs), label: "Kết quả đã tạo" },
      ]
    : [];

  return (
    <div className="garden-page relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <div className="garden-page-bg" aria-hidden="true" />

      <div className="relative z-10 space-y-8 px-4 py-6 md:px-8 md:py-8">
        {/* Hero — trái nội dung / phải cây lớn */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.7fr] lg:items-start">
          {/* LEFT */}
          <div>
            <span className="text-2xl">🌿</span>
            <h1 className="mt-2 text-3xl font-extrabold"><GradientTitle text="Khu vườn của bạn" /></h1>
            <p
              className="mt-2 max-w-md bg-clip-text text-lg font-medium italic leading-snug text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #2563EB, #7C3AED, #F97316)" }}
            >
              Mỗi hành động nhỏ,
              <br />
              đều đang vun đắp cho sự trưởng thành.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
              Đây là nơi Companion ghi nhận hành trình học tập, khám phá và trưởng thành thật của bạn —
              không phải cấp độ hay điểm số giả lập.
            </p>

            {/* Stats 2x2 — dữ liệu thật, không còn Level/Tier giả */}
            {garden && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label} className="garden-glass-card gemos-gem-card rounded-2xl p-3 text-center">
                    <s.icon className="mx-auto h-4 w-4 text-green-600" />
                    <p className="mt-1 text-base font-extrabold text-gray-900">{s.value}</p>
                    <p className="text-[10px] leading-snug text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
            {garden && garden.totalOutputs === 0 && (
              <p className="mt-3 text-xs text-gray-400">
                Khu vườn còn trống — mỗi Nhiệm vụ bạn hoàn thành ở Workspace sẽ làm khu vườn lớn lên thật.
              </p>
            )}

            {/* Quote nhỏ */}
            <div className="mt-4 rounded-xl border border-green-100 bg-green-50/60 px-4 py-3">
              <p className="text-xs leading-relaxed text-green-800">
                <span className="mr-1">🌱</span>
                Khu vườn của bạn phản chiếu đúng những gì bạn đã thật sự làm — không hơn, không kém.
              </p>
            </div>
          </div>

          {/* RIGHT — cây thật, linh hồn của trang (hình minh hoạ, không phải số liệu) */}
          <div className="relative">
            <GardenScene />

            <div className="garden-glass-card gemos-glass-card absolute -bottom-6 right-2 w-[88%] rounded-2xl p-4 sm:w-[80%] lg:right-4">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-700">
                <span className="mt-0.5 shrink-0">🪴</span>
                <span>
                  <span className="font-semibold text-gray-900">Gợi ý chăm sóc khu vườn. </span>
                  {GARDEN_CARE_TIP}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Section dưới: 2 card */}
        <div className="grid gap-6 pt-8 lg:grid-cols-2">
          {/* Những hoạt động gần đây — dữ liệu thật */}
          <div className="garden-glass-card gemos-gem-card rounded-2xl p-5">
            <h2 className="gemos-card-title text-base font-bold text-gray-900">Hoạt động gần đây</h2>
            <div className="mt-4 space-y-2">
              {activity.length === 0 ? (
                <p className="text-xs text-gray-400">
                  Chưa có hoạt động nào được ghi nhận — hãy thử một Nhiệm vụ trong Học viện AI hoặc Workspace.
                </p>
              ) : (
                activity.map((a, i) => (
                  <div key={`${a.timestamp}-${i}`} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <p className="min-w-0 flex-1 text-xs text-gray-700 sm:text-sm">{a.label}</p>
                    <span className="shrink-0 text-[10px] text-gray-400">{new Date(a.timestamp).toLocaleDateString("vi-VN")}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chăm sóc khu vườn — gợi ý chung, không phải số liệu cá nhân */}
          <div className="garden-glass-card gemos-gem-card relative overflow-hidden rounded-2xl p-5">
            <h2 className="gemos-card-title text-base font-bold text-gray-900">Chăm sóc khu vườn</h2>
            <p className="text-xs text-gray-400">Gợi ý cho hôm nay</p>
            <div className="relative mt-4 space-y-3 pr-20 sm:pr-28">
              {CARE_SUGGESTIONS.map((c, i) => {
                const Icon = CARE_ICONS[i] ?? Sprout;
                return (
                  <div key={c.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 h-24 w-20 overflow-hidden rounded-xl opacity-90 sm:h-28 sm:w-24">
              <Image src="/images/garden/garden-care-visual.jpg" alt="" fill sizes="120px" className="object-cover" />
            </div>
          </div>
        </div>

        <GrowthActivityPanel variant="garden" />

        <footer className="garden-glass-card gemos-glass-card mt-8 rounded-3xl p-8 text-center">
          <Quote className="mx-auto h-6 w-6 text-blue-200" />
          <p className="mx-auto mt-3 max-w-lg whitespace-pre-line text-sm leading-relaxed text-gray-700 sm:text-base">
            {GARDEN_FOOTER_QUOTE}
          </p>
        </footer>
      </div>
    </div>
  );
}
