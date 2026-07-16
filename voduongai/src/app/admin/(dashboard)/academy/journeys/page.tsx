"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { ACADEMY_WORKSPACE_SECTIONS } from "@/lib/admin/academy/navigation";
import { Badge } from "@/components/admin/ui/Badge";
import { getAllLearningJourneys, computeJourneyStatus } from "@/features/academy/services/journey.service";
import { JOURNEY_STAGE_LABELS } from "@/features/academy/types/journey.types";

const STAGE_TONE: Record<string, "green" | "blue" | "gray" | "orange" | "red"> = {
  READY: "green",
  GROWTH: "green",
  REFLECTION: "blue",
  APPLICATION: "blue",
  PRACTICE: "orange",
  LEARNING: "orange",
  PREPARATION: "gray",
};

/**
 * Learning Journeys — READ-ONLY (Task 1 + Task 4, ACADEMY-SPR-401).
 *
 * KHÔNG có Add/Edit/Delete — Learning Journey chiếu 1:1 từ CKOS Collection
 * (`journey.service.ts`, `getAllLearningJourneys()`), Academy không sở
 * hữu dữ liệu này (đúng "Academy chỉ sở hữu Learning Experience, không sở
 * hữu Knowledge" — Task 4). Đây là view tham chiếu, giống nguyên tắc
 * "Portal Mapping" của Website Workspace (WEB-SPR-202) — tổng hợp, không
 * tạo dữ liệu nghiệp vụ mới.
 */
export default function AcademyJourneysPage() {
  const journeys = getAllLearningJourneys();

  return (
    <AdminWorkspaceShell
      title="Hành trình học tập"
      description="Chỉ đọc — mỗi hành trình học chiếu 1:1 từ 1 bộ sưu tập của Hệ tri thức AI. Sửa nội dung hành trình phải thực hiện ở Hệ tri thức AI (kho tri thức/bộ sưu tập), không phải ở đây."
      rootHref="/admin/academy"
      sections={ACADEMY_WORKSPACE_SECTIONS}
    >
      <div className="space-y-4">
        {journeys.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/40">
            Chưa có hành trình học nào — Hệ tri thức AI chưa có bộ sưu tập nào.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="px-4 py-3 font-semibold">Hành trình</th>
                  <th className="px-4 py-3 font-semibold">Bộ sưu tập CKOS (slug)</th>
                  <th className="px-4 py-3 font-semibold">Giai đoạn hiện tại</th>
                  <th className="px-4 py-3 font-semibold">Tiến độ nội bộ</th>
                </tr>
              </thead>
              <tbody>
                {journeys.map((journey) => {
                  const status = computeJourneyStatus(journey);
                  return (
                    <tr key={journey.id} className="border-b border-white/5">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white/80">{journey.title}</p>
                        <p className="mt-0.5 text-xs text-white/40">{journey.goal}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-white/60">{journey.collectionSlug}</td>
                      <td className="px-4 py-3">
                        <Badge tone={STAGE_TONE[status.stage] ?? "gray"}>{JOURNEY_STAGE_LABELS[status.stage]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-white/60">{status.percent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminWorkspaceShell>
  );
}
