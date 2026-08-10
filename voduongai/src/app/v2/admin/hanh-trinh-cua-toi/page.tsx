import { Award, Layers, Percent, Users } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { ProgressBar } from "@/components/v2/ui/Display";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { listJourneyStages, listMilestones } from "@/lib/v2/data/catalog";

export const metadata = { title: "Hành trình của tôi — Admin" };

export default async function AdminHanhTrinhPage() {
  const [stages, milestones] = await Promise.all([listJourneyStages(), listMilestones()]);

  const stageRows: TableRow[] = stages.map((stage) => ({
    id: stage.id,
    cells: [
      { t: "strong", v: stage.name },
      { t: "muted", v: stage.description },
      { t: "text", v: `${stage.courseCount} khoá` },
      { t: "progress", value: stage.progress, label: `${stage.progress}%` },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tiện ích nhanh › Hành trình của tôi"
        title="Quản lý Hành trình của tôi"
        description="Quản lý các giai đoạn lộ trình, huy hiệu thành tựu và khoá học gợi ý."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "stages", value: "5", label: "Giai đoạn lộ trình", icon: Layers, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "badges", value: "12", label: "Huy hiệu thành tựu", icon: Award, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
          { id: "following", value: "4.780", label: "Người dùng đang theo dõi", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "7,4%", trend: "up" },
          { id: "progress", value: "68%", label: "Tiến độ trung bình", icon: Percent, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "3,2%", trend: "up" },
        ]}
      />

      <DataTable
        title="Giai đoạn lộ trình"
        headers={["Giai đoạn", "Mô tả", "Khoá học", "Tiến độ mẫu"]}
        rows={stageRows}
        pageSize={6}
      />

      <Card padding="admin">
        <CardHead title="Huy hiệu thành tựu" />
        <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2 min-[1300px]:grid-cols-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="rounded-[var(--v2-radius-md)] border border-[var(--v2-line)] bg-[var(--v2-bg)] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h5 className="text-[13.5px] font-bold">{milestone.title}</h5>
                <span className="rounded-md bg-[var(--v2-violet-light)] px-2 py-[2px] text-[11px] font-extrabold text-[var(--v2-violet)]">
                  +{milestone.xp} XP
                </span>
              </div>
              <p className="mb-3 text-[12px] leading-[1.45] text-[var(--v2-muted)]">
                {milestone.description}
              </p>
              <ProgressBar
                value={milestone.achievedAt ? 100 : 0}
                height={5}
                label={`Tiến độ ${milestone.title}`}
              />
              <div className="mt-2 text-[11px] text-[var(--v2-muted)]">
                {milestone.achievedAt ? `Đạt ngày ${milestone.achievedAt}` : "Chưa đạt"}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
