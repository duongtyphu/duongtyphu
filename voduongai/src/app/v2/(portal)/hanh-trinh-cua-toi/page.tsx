import { Award, Check, Route, Trophy } from "lucide-react";

import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { ProgressBar } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { listJourneyStages, listMilestones } from "@/lib/v2/data/catalog";
import { getJourneySummary } from "@/lib/v2/data/home";

export const metadata = { title: "Hành trình của tôi" };

export default async function HanhTrinhPage() {
  const [stages, milestones, summary] = await Promise.all([
    listJourneyStages(),
    listMilestones(),
    getJourneySummary(),
  ]);

  const achieved = milestones.filter((milestone) => milestone.achievedAt);

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Hành trình của tôi</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Năm giai đoạn từ hiểu AI là gì tới xây được tài sản số của riêng bạn.
            </p>
          </div>
          <IcoBox
            icon={Route}
            size="xl"
            background="linear-gradient(145deg,#8b6bff,#5a37e6)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <section>
          <SectionHead title="Các giai đoạn" />
          <div className="flex flex-col gap-[14px]">
            {stages.map((stage, index) => {
              const done = stage.progress === 100;
              return (
                <Card key={stage.id}>
                  <div className="flex items-start gap-4">
                    <span
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold",
                        done
                          ? "bg-[var(--v2-green)] text-white"
                          : stage.progress > 0
                            ? "bg-[var(--v2-violet)] text-white"
                            : "bg-[var(--v2-bg)] text-[var(--v2-muted)]",
                      ].join(" ")}
                    >
                      {done ? <Check className="h-[18px] w-[18px]" aria-hidden="true" /> : index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-[15px] font-bold">{stage.name}</h3>
                        <span className="text-[12px] font-bold text-[var(--v2-muted)]">
                          {stage.courseCount} khoá · {stage.progress}%
                        </span>
                      </div>
                      <p className="mb-3 text-[12.5px] text-[var(--v2-muted)]">{stage.description}</p>
                      <ProgressBar
                        value={stage.progress}
                        height={6}
                        label={`Tiến độ ${stage.name}`}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHead title={`Huy hiệu thành tựu — đã đạt ${achieved.length}/${milestones.length}`} />
          <div className="grid grid-cols-1 gap-[14px] min-[760px]:grid-cols-2 min-[1300px]:grid-cols-3">
            {milestones.map((milestone) => {
              const unlocked = Boolean(milestone.achievedAt);
              return (
                <Card key={milestone.id} className={unlocked ? "" : "opacity-60"}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <IcoBox
                      icon={unlocked ? Trophy : Award}
                      size="lg"
                      background={
                        unlocked
                          ? "linear-gradient(145deg,#ffc964,#e2b23c)"
                          : "linear-gradient(145deg,#c8c4dd,#9791b8)"
                      }
                      color="#fff"
                    />
                    <span className="rounded-md bg-[var(--v2-violet-light)] px-2 py-[3px] text-[11px] font-extrabold text-[var(--v2-violet)]">
                      +{milestone.xp} XP
                    </span>
                  </div>
                  <h4 className="text-[13.5px] font-bold">{milestone.title}</h4>
                  <p className="mt-1 text-[12px] leading-[1.45] text-[var(--v2-muted)]">
                    {milestone.description}
                  </p>
                  <div className="mt-3 text-[11px] text-[var(--v2-muted)]">
                    {unlocked ? `Đạt ngày ${milestone.achievedAt}` : "Chưa mở khoá"}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead title="Cấp độ hiện tại" />
          <div className="mb-[14px] flex items-center gap-3">
            <IcoBox
              icon={Trophy}
              size="lg"
              background="linear-gradient(145deg,#b18bff,#6d4aff)"
              color="#fff"
            />
            <div>
              <div className="text-[14px] font-extrabold">{summary.levelName}</div>
              <div className="text-[11.5px] text-[var(--v2-muted)]">
                {summary.xp.toLocaleString("vi-VN")} / {summary.xpTarget.toLocaleString("vi-VN")} XP
              </div>
            </div>
          </div>
          <ProgressBar
            value={(summary.xp / summary.xpTarget) * 100}
            label="Tiến độ kinh nghiệm"
          />
        </Card>

        <Card>
          <CardHead title="Chỉ số" />
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              { label: "Chuỗi ngày học", value: `${summary.streakDays} ngày` },
              { label: "Tổng thời gian", value: summary.totalLearnTime },
              { label: "Huy hiệu", value: String(achieved.length) },
              { label: "Giai đoạn xong", value: String(stages.filter((s) => s.progress === 100).length) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[10px] bg-[var(--v2-bg)] p-[10px] text-center">
                <div className="text-[15px] font-extrabold">{stat.value}</div>
                <div className="mt-[2px] text-[10.5px] text-[var(--v2-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
