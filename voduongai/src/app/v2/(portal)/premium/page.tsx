import { Check, Crown } from "lucide-react";

import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatVnd } from "@/lib/v2/data/client";
import { listPremiumFaqs, listPremiumPlans } from "@/lib/v2/data/commerce";

export const metadata = { title: "Premium" };

export default async function PremiumPage() {
  const [plans, faqs] = await Promise.all([listPremiumPlans(), listPremiumFaqs()]);

  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <section className="relative overflow-hidden rounded-[var(--v2-radius-lg)] px-11 py-8 text-white [background:radial-gradient(circle_at_80%_20%,#4a3691_0%,transparent_45%),linear-gradient(160deg,#241c4d_0%,#1a1440_55%,#100b2c_100%)]">
        <div className="relative z-[1] max-w-[620px]">
          <span className="mb-3 inline-block rounded-md bg-[rgba(226,178,60,.16)] px-[10px] py-1 text-[11.5px] font-extrabold text-[var(--v2-gold)]">
            VDAI PREMIUM
          </span>
          <h1 className="mb-[10px] text-[26px] font-extrabold">
            Mở khoá toàn bộ hệ sinh thái học AI
          </h1>
          <p className="text-[14.5px] leading-[1.55] text-[#cfc8ee]">
            Toàn bộ khoá học, Companion AI không giới hạn, Hệ tri thức CKOS bản đầy đủ và bộ công cụ
            cao cấp — trong một gói duy nhất.
          </p>
        </div>
        <IcoBox
          icon={Crown}
          size="xl"
          background="linear-gradient(145deg,#ffc964,#e2b23c)"
          color="#5a3c00"
          className="absolute top-1/2 right-11 z-[1] -translate-y-1/2 max-[900px]:hidden"
        />
      </section>

      <section>
        <SectionHead title="Chọn gói phù hợp với bạn" />
        <div className="grid grid-cols-1 gap-[18px] min-[900px]:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={[
                "flex flex-col rounded-[var(--v2-radius-card)] border bg-[var(--v2-surface)] p-[22px]",
                plan.highlight
                  ? "border-[var(--v2-violet)] shadow-[0_10px_28px_rgba(109,74,255,.18)]"
                  : "border-[var(--v2-line)]",
              ].join(" ")}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-[16px] font-extrabold">{plan.name}</h3>
                {plan.badge ? <Badge tone={plan.highlight ? "violet" : "gold"}>{plan.badge}</Badge> : null}
              </div>

              <div className="text-[26px] font-extrabold">{formatVnd(plan.priceMonthly)}</div>
              <div className="mb-1 text-[12px] text-[var(--v2-muted)]">mỗi tháng</div>
              <div className="mb-5 text-[12px] text-[var(--v2-muted)]">
                Thanh toán trọn kỳ {formatVnd(plan.priceYearly)}
              </div>

              <ul className="mb-6 flex flex-col gap-[10px]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[13px] leading-[1.45]">
                    <Check
                      className="mt-[3px] h-[14px] w-[14px] shrink-0 text-[var(--v2-green)]"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={[
                  "mt-auto w-full rounded-[var(--v2-radius-sm)] p-[11px] text-[13px] font-bold transition-[transform,filter] duration-150 hover:-translate-y-px hover:brightness-110",
                  plan.highlight
                    ? "bg-[linear-gradient(135deg,var(--v2-violet),#9b7bff)] text-white"
                    : "border border-[var(--v2-line)] bg-[var(--v2-surface)] text-[var(--v2-text)]",
                ].join(" ")}
              >
                Chọn gói này
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="Câu hỏi thường gặp" />
        <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardHead title={faq.question} />
              <p className="text-[13px] leading-[1.6] text-[var(--v2-muted)]">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
