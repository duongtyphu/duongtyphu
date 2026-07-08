import Link from "next/link";
import { sops } from "@/data/sop";
import { prompts } from "@/data/prompts";

export const metadata = { title: "SOP", description: "Quy trình chuẩn (SOP) vận hành Affiliate Marketing và sản xuất nội dung của VO DUONG AI." };

export default function SopPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">SOP — Quy trình vận hành</h1>
        <p className="mt-2 text-gray-900">
          Quy trình chuẩn hoá để bạn (và đội nhóm) làm việc nhất quán, không phụ thuộc cảm hứng.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sops.map((s) => {
          const relatedPrompt = s.relatedPromptId ? prompts.find((p) => p.id === s.relatedPromptId) : undefined;
          return (
            <div key={s.title} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-900">{s.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-600">Khi nào dùng</p>
              <p className="mt-1 text-sm text-gray-600">{s.whenToUse}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-600">Khi nào KHÔNG nên dùng</p>
              <p className="mt-1 text-sm text-gray-600">{s.whenNotToUse}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-600">Các bước</p>
              <ol className="mt-1 space-y-1.5">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="shrink-0 font-semibold text-gray-400">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              {relatedPrompt && (
                <Link
                  href={`/portal/prompts/${relatedPrompt.id}`}
                  className="mt-3 block text-xs font-semibold text-brand-blue hover:underline"
                >
                  Prompt dùng trong quy trình này: {relatedPrompt.title} →
                </Link>
              )}
              <Link
                href="/portal/workspace"
                className="mt-3 block text-xs font-semibold text-gray-500 hover:text-blue-600"
              >
                Thực hành quy trình này ở Workspace →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
