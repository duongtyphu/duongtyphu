import { CheckCircle2 } from "lucide-react";

/**
 * Next Step Card (EPIC-UX-002, sửa lại theo PMO — "Mentor Workspace
 * Truthful States"). CHỈ render khi `steps` có dữ liệu thật (do Runtime
 * cung cấp qua `ChatMessage.nextSteps` — xem `types.ts`) — KHÔNG còn dùng
 * 3 bước mock cố định trong trải nghiệm production. Component/props giữ
 * nguyên để Runtime tích hợp dữ liệu thật sau này chỉ cần truyền `steps`,
 * không cần sửa lại component này.
 */
export function CompanionNextStepCard({ steps }: { steps?: string[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="ml-10 mt-2 max-w-[85%] rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-blue-700">Bước tiếp theo</p>
      <ul className="mt-2 space-y-1.5">
        {steps.map((step) => (
          <li key={step} className="flex items-start gap-2 text-sm leading-relaxed text-gray-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
