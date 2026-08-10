import { LayoutGrid, Sparkles } from "lucide-react";

import { Card, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { listWorkspaceTools } from "@/lib/v2/data/catalog";

export const metadata = { title: "AI Workspace" };

const GROUP_GRADIENT: Record<string, string> = {
  "Sáng tạo": "linear-gradient(145deg,#8b6bff,#5a37e6)",
  "Dữ liệu": "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  "Kinh doanh": "linear-gradient(145deg,#3ecf7e,#189a52)",
  "Năng suất": "linear-gradient(145deg,#4bc4e0,#0e7490)",
  "Vận hành": "linear-gradient(145deg,#ff9d52,#b45309)",
};

export default async function AiWorkspacePage() {
  const tools = await listWorkspaceTools();
  const visible = tools.filter((tool) => tool.visible);
  const groups = Array.from(new Set(visible.map((tool) => tool.group)));

  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-extrabold">AI Workspace</h1>
          <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
            Nơi bạn thực hành, lưu trữ và triển khai ý tưởng thành sản phẩm thực tế.
          </p>
        </div>
        <IcoBox
          icon={LayoutGrid}
          size="xl"
          background="linear-gradient(145deg,#5f8fff,#1d5fd8)"
          color="#fff"
          className="max-[900px]:hidden"
        />
      </div>

      {groups.map((group) => (
        <section key={group}>
          <SectionHead title={group} />
          <div className="grid grid-cols-1 gap-[14px] min-[760px]:grid-cols-2 min-[1300px]:grid-cols-4">
            {visible
              .filter((tool) => tool.group === group)
              .map((tool) => (
                <Card key={tool.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <IcoBox
                      icon={Sparkles}
                      size="md"
                      background={GROUP_GRADIENT[tool.group] ?? "linear-gradient(145deg,#8b6bff,#5a37e6)"}
                      color="#fff"
                    />
                    {tool.status === "beta" ? <Badge tone="gold">Thử nghiệm</Badge> : null}
                  </div>
                  <h3 className="text-[13.5px] leading-[1.35] font-bold">{tool.name}</h3>
                  <p className="text-[11.5px] text-[var(--v2-muted)]">{tool.kind}</p>
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="text-[11.5px] text-[var(--v2-muted)]">
                      {tool.usageCount.toLocaleString("vi-VN")} lượt dùng
                    </span>
                    <span className="rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet-light)] px-3 py-[6px] text-[12px] font-bold text-[var(--v2-violet)]">
                      Mở
                    </span>
                  </div>
                </Card>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
