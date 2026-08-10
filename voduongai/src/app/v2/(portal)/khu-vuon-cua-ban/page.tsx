import { Check, Flower2, Gift, Sprout } from "lucide-react";

import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge, ProgressBar } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatDate } from "@/lib/v2/data/client";
import { STAGE_LABEL, listDailyQuests, listGardenPlants } from "@/lib/v2/data/catalog";

export const metadata = { title: "Khu vườn của bạn" };

/** Màu nền thẻ cây theo giai đoạn — càng trưởng thành càng xanh đậm. */
const STAGE_BACKGROUND: Record<string, string> = {
  "hat-giong": "linear-gradient(155deg,#f6f5fa 0%,#e6e4ef 100%)",
  "nay-mam": "linear-gradient(155deg,#f2fbf5 0%,#dcf2e5 100%)",
  "phat-trien": "linear-gradient(155deg,#eafaf0 0%,#cdf0dc 100%)",
  "ra-hoa": "linear-gradient(155deg,#f4efff 0%,#e4d9ff 100%)",
  "ket-trai": "linear-gradient(155deg,#fff6e4 0%,#ffe9bd 100%)",
};

export default async function KhuVuonPage() {
  const [plants, quests] = await Promise.all([listGardenPlants(), listDailyQuests()]);
  const doneCount = quests.filter((quest) => quest.done).length;

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Khu vườn của bạn</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Mỗi khoá học là một cây. Học đều đặn thì cây lớn — bỏ lâu thì cây đứng lại.
            </p>
          </div>
          <IcoBox
            icon={Flower2}
            size="xl"
            background="linear-gradient(145deg,#3ecf7e,#189a52)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <section>
          <SectionHead title={`${plants.length} cây trong vườn`} />
          <div className="grid grid-cols-1 gap-[14px] min-[760px]:grid-cols-2 min-[1300px]:grid-cols-3">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="flex flex-col gap-3 rounded-[var(--v2-radius-md)] border border-black/4 p-4 shadow-[0_2px_8px_rgba(30,20,80,.06)]"
                style={{ background: STAGE_BACKGROUND[plant.stage] }}
              >
                <div className="flex items-start justify-between gap-3">
                  <IcoBox
                    icon={Sprout}
                    size="md"
                    background="linear-gradient(145deg,#3ecf7e,#189a52)"
                    color="#fff"
                  />
                  <span className="rounded-md bg-white/70 px-[9px] py-[3px] text-[11px] font-extrabold text-[var(--v2-text)]">
                    {STAGE_LABEL[plant.stage]}
                  </span>
                </div>
                <h3 className="text-[14px] font-bold">{plant.name}</h3>
                <p className="text-[11.5px] leading-[1.45] text-[var(--v2-muted)]">
                  {plant.linkedCourse}
                </p>
                <ProgressBar
                  value={plant.progress}
                  height={6}
                  trackClassName="bg-black/8"
                  fillStyle="linear-gradient(90deg,#3ecf7e,#189a52)"
                  label={`Tiến độ ${plant.name}`}
                />
                <div className="flex items-center justify-between text-[11px] text-[var(--v2-muted)]">
                  <span>{plant.progress}%</span>
                  <span>Gieo {formatDate(plant.plantedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead
            title="Nhiệm vụ hôm nay"
            action={
              <Badge tone={doneCount === quests.length ? "green" : "violet"}>
                {doneCount}/{quests.length}
              </Badge>
            }
          />
          {quests.map((quest) => (
            <div
              key={quest.id}
              className="flex items-center gap-[10px] border-b border-[var(--v2-line)] py-[10px] last:border-b-0"
            >
              <span
                className={[
                  "flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border",
                  quest.done
                    ? "border-[var(--v2-green)] bg-[var(--v2-green)] text-white"
                    : "border-[var(--v2-line)]",
                ].join(" ")}
              >
                {quest.done ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
              </span>
              <span
                className={[
                  "flex-1 text-[12.5px] font-semibold",
                  quest.done ? "text-[var(--v2-muted)] line-through" : "",
                ].join(" ")}
              >
                {quest.title}
              </span>
              <span className="shrink-0 text-[11px] font-bold text-[var(--v2-violet)]">
                {quest.reward}
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <CardHead title="Phần thưởng sắp mở" />
          <div className="flex items-start gap-[10px]">
            <IcoBox icon={Gift} size="md" />
            <div>
              <div className="text-[13px] font-bold">Hạt giống hiếm</div>
              <p className="mt-1 text-[11.5px] leading-[1.45] text-[var(--v2-muted)]">
                Hoàn thành đủ 5 nhiệm vụ trong ngày để nhận một hạt giống hiếm cho khu vườn.
              </p>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
