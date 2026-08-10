import { Award, Flower2, Gift, Users } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { STAGE_LABEL, listDailyQuests, listGardenPlants } from "@/lib/v2/data/catalog";

export const metadata = { title: "Khu vườn của bạn — Admin" };

export default async function AdminKhuVuonPage() {
  const [quests, plants] = await Promise.all([listDailyQuests(), listGardenPlants()]);

  const questRows: TableRow[] = quests.map((quest) => ({
    id: quest.id,
    cells: [
      { t: "strong", v: quest.title },
      {
        t: "tag",
        label: quest.reward,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      { t: "status", label: "Đang hiển thị", color: "var(--v2-green)" },
    ],
  }));

  const plantRows: TableRow[] = plants.map((plant) => ({
    id: plant.id,
    cells: [
      { t: "strong", v: plant.name },
      {
        t: "tag",
        label: STAGE_LABEL[plant.stage],
        background: "#e6f7ed",
        color: "#189a52",
      },
      { t: "muted", v: plant.linkedCourse },
      { t: "progress", value: plant.progress, label: `${plant.progress}%` },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tiện ích nhanh › Khu vườn của bạn"
        title="Quản lý Khu vườn của bạn"
        description="Quản lý nhiệm vụ hằng ngày, huy hiệu vườn và vật phẩm thu thập."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "quests", value: "5", label: "Nhiệm vụ hằng ngày", icon: Gift, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "gardeners", value: "3.240", label: "Người dùng có vườn", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "8,2%", trend: "up" },
          { id: "badges", value: "10", label: "Huy hiệu vườn", icon: Award, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
          { id: "items", value: "18", label: "Vật phẩm", icon: Flower2, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
        ]}
      />

      <DataTable
        title="Nhiệm vụ hằng ngày"
        headers={["Nhiệm vụ", "Phần thưởng", "Hiển thị"]}
        rows={questRows}
        pageSize={6}
      />

      <DataTable
        title="Cây trồng theo khoá học"
        headers={["Cây", "Giai đoạn", "Khoá học liên kết", "Tiến độ"]}
        rows={plantRows}
        pageSize={6}
      />
    </div>
  );
}
