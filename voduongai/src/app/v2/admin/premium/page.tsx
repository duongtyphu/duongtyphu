import { Crown, Percent, TrendingDown, Wallet } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { ListEditorPanel } from "@/components/v2/ui/ListEditorPanel";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { TabsRow } from "@/components/v2/ui/TabsRow";
import { formatVnd } from "@/lib/v2/data/client";
import { listPremiumFaqs, listPremiumPlans } from "@/lib/v2/data/commerce";

export const metadata = { title: "Premium — Admin" };

export default async function AdminPremiumPage() {
  const [plans, faqs] = await Promise.all([listPremiumPlans(), listPremiumFaqs()]);

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Premium"
        title="Quản lý Premium"
        description="Quản lý các gói Premium, quyền lợi và câu hỏi thường gặp trên Portal."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "members", value: "2.384", label: "Thành viên Premium", icon: Crown, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)", delta: "8,1%", trend: "up" },
          { id: "revenue", value: "486,2 Tr₫", label: "Doanh thu (30 ngày)", icon: Wallet, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "15,7%", trend: "up" },
          { id: "conversion", value: "6,8%", label: "Tỷ lệ chuyển đổi", icon: Percent, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "0,6%", trend: "up" },
          { id: "churn", value: "4,1%", label: "Tỷ lệ huỷ gói", icon: TrendingDown, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "0,3%", trend: "down" },
        ]}
      />

      <TabsRow
        tabs={[
          {
            id: "plans",
            label: "Gói Premium",
            content: (
              <>
                <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-3">
                  {plans.map((plan) => (
                    <Card key={plan.id} padding="admin">
                      <CardHead
                        title={plan.name}
                        action={
                          plan.badge ? (
                            <span className="rounded-md bg-[#fdf1e0] px-2 py-1 text-[11px] font-extrabold text-[#a9822c]">
                              {plan.badge}
                            </span>
                          ) : null
                        }
                      />
                      <div className="mb-1 text-[22px] font-extrabold">
                        {formatVnd(plan.priceMonthly)}
                        <span className="text-[12px] font-semibold text-[var(--v2-muted)]">
                          {" "}
                          / tháng
                        </span>
                      </div>
                      <div className="mb-4 text-[12px] text-[var(--v2-muted)]">
                        Thanh toán trọn kỳ: {formatVnd(plan.priceYearly)}
                      </div>
                      <ul className="flex flex-col gap-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex gap-2 text-[12.5px]">
                            <span className="text-[var(--v2-violet)]">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </>
            ),
          },
          {
            id: "faq",
            label: "Câu hỏi thường gặp",
            content: (
              <ListEditorPanel
                listTitle={`${faqs.length} câu hỏi`}
                addLabel="Thêm câu hỏi"
                formTitle="Chi tiết câu hỏi đã chọn"
                titleField="question"
                items={faqs.map((faq) => ({
                  id: faq.id,
                  title: faq.question,
                  subtitle: faq.answer.slice(0, 60),
                  values: { question: faq.question, answer: faq.answer },
                }))}
                fields={[
                  { name: "question", label: "Câu hỏi", type: "text" },
                  { name: "answer", label: "Câu trả lời", type: "textarea", rows: 5 },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
