import { Building2, Check } from "lucide-react";

import { Card, SectionHead } from "@/components/v2/ui/Card";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import type { PartnerProfile } from "@/lib/v2/data/ecosystem";

/**
 * Khuôn chung cho ba trang đối tác hệ sinh thái (DigiU, Ohana, SolarGroup).
 * Cả ba trong mockup có cùng cấu trúc, chỉ khác nội dung và màu nhấn.
 */
export function PartnerPage({ partner }: { partner: PartnerProfile }) {
  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <section className="relative overflow-hidden rounded-[var(--v2-radius-lg)] px-11 py-8 text-white [background:radial-gradient(circle_at_80%_20%,#4a3691_0%,transparent_45%),linear-gradient(160deg,#241c4d_0%,#1a1440_55%,#100b2c_100%)]">
        <div className="relative z-[1] max-w-[660px]">
          <h1 className="mb-2 text-[28px] font-extrabold">{partner.name}</h1>
          <p className="mb-4 text-[13.5px] leading-[1.55] text-[#b8b0dd]">{partner.tagline}</p>
          <h2 className="mb-[10px] text-[19px] leading-[1.35] font-bold">{partner.heroTitle}</h2>
          <p className="text-[14px] leading-[1.6] text-[#cfc8ee]">{partner.heroBody}</p>
        </div>
        <IcoBox
          icon={Building2}
          size="xl"
          background={`linear-gradient(145deg,${partner.accentFrom},${partner.accentTo})`}
          color="#fff"
          className="absolute top-1/2 right-11 z-[1] -translate-y-1/2 max-[1000px]:hidden"
        />
      </section>

      <div className="grid grid-cols-2 gap-[14px] min-[1180px]:grid-cols-4">
        {partner.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[18px] text-center"
          >
            <div className="text-[22px] font-extrabold">{stat.value}</div>
            <div className="mt-1 text-[12px] text-[var(--v2-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <section>
        <SectionHead title={partner.aboutTitle} />
        <Card>
          <p className="text-[13.5px] leading-[1.7] text-[var(--v2-muted)]">{partner.aboutBody}</p>
        </Card>
      </section>

      <section>
        <SectionHead title={partner.pillarsTitle} />
        <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
          {partner.pillars.map((pillar) => (
            <Card key={pillar.id}>
              <IcoBox
                icon={Building2}
                size="md"
                background={`linear-gradient(145deg,${partner.accentFrom},${partner.accentTo})`}
                color="#fff"
                className="mb-3"
              />
              <h3 className="mb-2 text-[15px] font-bold">{pillar.title}</h3>
              <p className="text-[13px] leading-[1.6] text-[var(--v2-muted)]">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title={partner.milestonesTitle} />
        <Card padding="none">
          {partner.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-center gap-4 border-b border-[var(--v2-line)] px-[18px] py-4 last:border-b-0"
            >
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold",
                  milestone.done
                    ? "bg-[var(--v2-green)] text-white"
                    : "bg-[var(--v2-bg)] text-[var(--v2-muted)]",
                ].join(" ")}
              >
                {milestone.done ? <Check className="h-4 w-4" aria-hidden="true" /> : "•"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-bold text-[var(--v2-muted)]">
                  {milestone.period}
                </div>
                <div className="text-[13.5px] font-semibold">{milestone.title}</div>
              </div>
              <span className="shrink-0 text-[11.5px] font-bold text-[var(--v2-muted)]">
                {milestone.done ? "Hoàn thành" : "Đang triển khai"}
              </span>
            </div>
          ))}
        </Card>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--v2-radius-lg)] bg-[linear-gradient(145deg,#f4efff,#e4d9ff)] px-8 py-7">
        <div>
          <h3 className="mb-1 text-[18px] font-extrabold text-[var(--v2-violet-dark)]">
            {partner.ctaTitle}
          </h3>
          <p className="text-[13px] text-[var(--v2-violet-dark)]">{partner.ctaBody}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-[var(--v2-radius-sm)] bg-[linear-gradient(135deg,var(--v2-violet),#9b7bff)] px-6 py-3 text-[13.5px] font-bold text-white transition-[transform,filter] duration-150 hover:-translate-y-0.5 hover:brightness-110"
        >
          {partner.ctaLabel}
        </button>
      </section>
    </div>
  );
}
