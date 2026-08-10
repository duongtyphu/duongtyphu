import { Briefcase, CalendarDays, Wallet } from "lucide-react";

import { Card, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatDate } from "@/lib/v2/data/client";
import { OPP_STATUS_LABEL, listOpportunities } from "@/lib/v2/data/catalog";

export const metadata = { title: "Dự án & Cơ hội" };

export default async function DuAnCoHoiPage() {
  const opportunities = await listOpportunities();

  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-extrabold">Dự án & Cơ hội</h1>
          <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
            Cơ hội hợp tác, đầu tư và đồng hành trong các dự án công nghệ AI.
          </p>
        </div>
        <IcoBox
          icon={Briefcase}
          size="xl"
          background="linear-gradient(145deg,#ff9d52,#b45309)"
          color="#fff"
          className="max-[900px]:hidden"
        />
      </div>

      <section>
        <SectionHead title={`${opportunities.length} cơ hội`} />
        <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <Badge>{opportunity.partner}</Badge>
                <Badge
                  tone={
                    opportunity.status === "open"
                      ? "green"
                      : opportunity.status === "reviewing"
                        ? "gold"
                        : "neutral"
                  }
                >
                  {OPP_STATUS_LABEL[opportunity.status]}
                </Badge>
              </div>

              <div>
                <h3 className="text-[15px] leading-[1.35] font-bold">{opportunity.title}</h3>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-[var(--v2-muted)]">
                  {opportunity.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-[12px] text-[var(--v2-muted)]">
                <span className="flex items-center gap-[6px]">
                  <Wallet className="h-[14px] w-[14px]" aria-hidden="true" />
                  {opportunity.budget}
                </span>
                <span className="flex items-center gap-[6px]">
                  <CalendarDays className="h-[14px] w-[14px]" aria-hidden="true" />
                  Hạn {formatDate(opportunity.deadline)}
                </span>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-[6px]">
                  {opportunity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[var(--v2-bg)] px-2 py-1 text-[11px] font-semibold text-[var(--v2-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] px-4 py-2 text-[12.5px] font-bold text-white">
                  Xem chi tiết
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
