import { CheckCircle2, XCircle, MinusCircle, HelpCircle } from "lucide-react";
import { DEFAULT_POTENTIAL_ANALYSIS, type PotentialAnalysisItem } from "@/data/portal/ecosystems";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";

/**
 * Shared "Phân tích tiềm năng" (Potential Analysis) checklist table — used by
 * every ecosystem/sub-project/field-box page. Generic due-diligence criteria,
 * applicable to any project. No real analyst verdict has been recorded for
 * any ecosystem yet, so the default status for every row is honestly
 * "Chưa đánh giá" — never a fabricated ✓/✗. Accepts an optional `items`
 * override so a future CMS can plug in real per-ecosystem verdicts without
 * changing this component.
 */

const STATUS_LABEL: Record<PotentialAnalysisItem["status"], string> = {
  "not-assessed": "Chưa đánh giá",
  met: "Đạt",
  "not-met": "Chưa đạt",
  partial: "Một phần",
};

const STATUS_STYLE: Record<PotentialAnalysisItem["status"], string> = {
  "not-assessed": "bg-gray-100 text-gray-500",
  met: "bg-emerald-100 text-emerald-700",
  "not-met": "bg-red-100 text-red-700",
  partial: "bg-amber-100 text-amber-700",
};

const STATUS_ICON: Record<PotentialAnalysisItem["status"], typeof HelpCircle> = {
  "not-assessed": HelpCircle,
  met: CheckCircle2,
  "not-met": XCircle,
  partial: MinusCircle,
};

export function PotentialAnalysisTable({
  items = DEFAULT_POTENTIAL_ANALYSIS,
  id = "phan-tich-tiem-nang",
  title = "Phân tích tiềm năng",
}: {
  items?: PotentialAnalysisItem[];
  id?: string;
  title?: string;
}) {
  return (
    <section id={id}>
      <SectionHeader
        eyebrow="Đánh giá"
        title={title}
        description="Bảng tiêu chí đánh giá chung — mọi dòng hiện 'Chưa đánh giá' cho tới khi có đánh giá thật cụ thể."
      />
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-token-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 font-semibold text-gray-900">Tiêu chí</th>
              <th className="px-4 py-3 font-semibold text-gray-900">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const Icon = STATUS_ICON[item.status];
              return (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 align-top text-gray-700">
                    {item.criterion}
                    {item.note ? <p className="mt-1 text-xs text-gray-400">{item.note}</p> : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[item.status]}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {STATUS_LABEL[item.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
