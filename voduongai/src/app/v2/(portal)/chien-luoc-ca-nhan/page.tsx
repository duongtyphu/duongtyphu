import { Sparkles } from "lucide-react";

import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { ProgressBar } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { getCurrentGoal, listStrategyPillars } from "@/lib/v2/data/companion";

export const metadata = { title: "Chiến lược cá nhân" };

export default async function ChienLuocPage() {
  const [pillars, goal] = await Promise.all([listStrategyPillars(), getCurrentGoal()]);

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Chiến lược cá nhân</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Bốn trụ cột Companion đề xuất dựa trên mục tiêu và bối cảnh bạn đã chia sẻ.
            </p>
          </div>
          <IcoBox
            icon={Sparkles}
            size="xl"
            background="linear-gradient(145deg,#8b6bff,#5a37e6)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <section>
          <SectionHead title="Bốn trụ cột" />
          <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
            {pillars.map((pillar) => (
              <Card key={pillar.id}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <IcoBox icon={pillar.icon} size="md" />
                  <span className="text-[13px] font-extrabold text-[var(--v2-violet)]">
                    {pillar.progress}%
                  </span>
                </div>
                <h3 className="mb-2 text-[15px] font-bold">{pillar.title}</h3>
                <p className="mb-3 text-[12.5px] leading-[1.55] text-[var(--v2-muted)]">
                  {pillar.description}
                </p>
                <ProgressBar
                  value={pillar.progress}
                  height={6}
                  label={`Tiến độ ${pillar.title}`}
                />
                <ul className="mt-3 flex flex-col gap-2">
                  {pillar.actions.map((action) => (
                    <li key={action} className="flex gap-2 text-[12.5px] leading-[1.45]">
                      <span className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--v2-violet)]" />
                      {action}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead title="Mục tiêu đang theo đuổi" />
          <p className="mb-3 text-[13px] leading-[1.55] font-semibold">{goal.title}</p>
          <ProgressBar value={goal.progress} label="Tiến độ mục tiêu" />
          <div className="mt-2 text-[11.5px] text-[var(--v2-muted)]">
            Hoàn thành {goal.progress}%
          </div>
        </Card>

        <Card>
          <CardHead title="Companion nhắc bạn" />
          <p className="text-[12.5px] leading-[1.6] text-[var(--v2-muted)]">
            Trụ cột «Ảnh hưởng & cộng đồng» đang chậm nhất. Nếu quý này bạn muốn cân bằng lại, một
            bài case study có số liệu là bước nhỏ nhất tạo được khác biệt rõ nhất.
          </p>
        </Card>
      </aside>
    </div>
  );
}
