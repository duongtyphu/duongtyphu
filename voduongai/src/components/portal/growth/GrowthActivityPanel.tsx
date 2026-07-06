"use client";

/**
 * EPIC 03 — Sprint B4: Portfolio & Growth Engine.
 *
 * Khối "Hoạt động thật của bạn" — thêm vào Nhật ký học tập/Hành trình của
 * tôi/Khu vườn của bạn mà KHÔNG thay UI hiện có của 3 trang (nội dung
 * tĩnh cũ giữ nguyên, đây là section bổ sung). Đọc dữ liệu qua
 * `growth-view.ts` — không bao giờ hiển thị số liệu giả; nếu người dùng
 * chưa có hoạt động nào, hiển thị trạng thái rỗng trung thực.
 */

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  getRecentActivity,
  getJourneyProgress,
  getGardenSummary,
  type ActivityEntry,
  type JourneyProgressEntry,
  type GardenSummary,
} from "@/lib/portal/foundation/growth-view";

type Variant = "journal" | "journey" | "garden";

const VARIANT_TITLE: Record<Variant, string> = {
  journal: "Hoạt động thật của bạn",
  journey: "Tiến độ thật từ Workspace",
  garden: "Khu vườn được nuôi từ hoạt động thật",
};

export function GrowthActivityPanel({ variant }: { variant: Variant }) {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [progress, setProgress] = useState<JourneyProgressEntry[]>([]);
  const [garden, setGarden] = useState<GardenSummary | null>(null);

  useEffect(() => {
    // Đọc localStorage chỉ có ở client sau mount — phải set trong effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivity(getRecentActivity());
    setProgress(getJourneyProgress());
    setGarden(getGardenSummary());
  }, []);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
        {VARIANT_TITLE[variant]}
      </div>

      {variant === "journal" && (
        <div className="mt-4">
          {activity.length === 0 ? (
            <p className="text-sm text-gray-400">
              Chưa có hoạt động nào được ghi nhận — hãy thử một Nhiệm vụ trong Học viện AI hoặc AI Workspace.
            </p>
          ) : (
            <ol className="space-y-2.5">
              {activity.map((entry, i) => (
                <li key={`${entry.timestamp}-${i}`} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{entry.label}</span>
                  <span className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString("vi-VN")}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {variant === "journey" && (
        <div className="mt-4">
          {progress.length === 0 ? (
            <p className="text-sm text-gray-400">
              Bạn chưa bắt đầu Nhiệm vụ nào — chọn một hành trình ở Học viện AI để thấy tiến độ thật tại đây.
            </p>
          ) : (
            <ul className="space-y-3">
              {progress.map((entry, i) => (
                <li key={`${entry.missionId ?? entry.missionGoal}-${i}`} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-sm">
                  <span className="text-gray-700">{entry.missionGoal}</span>
                  <span className="flex items-center gap-2 text-xs text-gray-500">
                    {entry.outputCount} Kết quả
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${entry.isCompleted ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                      {entry.isCompleted ? "Hoàn thành" : "Đang làm"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {variant === "garden" && garden && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Cây (Nhiệm vụ hoàn thành)", value: garden.missionsCompleted },
            { label: "Khu vực (Journey đã chạm)", value: garden.journeysTouched },
            { label: "Loài cây (đã thực hành)", value: garden.competenciesPracticed },
            { label: "Kết quả đã tạo", value: garden.totalOutputs },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center">
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-[11px] leading-tight text-gray-500">{stat.label}</p>
            </div>
          ))}
          {garden.totalOutputs === 0 && (
            <p className="col-span-2 mt-1 text-xs text-gray-400 sm:col-span-4">
              Khu vườn còn trống — mỗi Nhiệm vụ bạn hoàn thành sẽ làm khu vườn lớn lên thật, không phải điểm số.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
