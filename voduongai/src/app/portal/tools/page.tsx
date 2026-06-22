import Link from "next/link";
import { tools } from "@/data/tools";

export const metadata = { title: "Tool Library" };

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">Tool Library</h1>
        <p className="mt-2 text-brand-gray-500">
          Công cụ AI tôi đã thử nghiệm và sử dụng thực tế, theo từng nhóm.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.id}
            href={`/portal/tools/${t.id}`}
            className="rounded-2xl border border-brand-gray-200 bg-white p-5 transition hover:shadow-lg hover:shadow-brand-blue/10"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-lg gradient-surface" />
              <span className="rounded-full bg-brand-gray-50 px-2.5 py-0.5 text-[10px] font-semibold text-brand-gray-500">
                {t.pricing}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-brand-navy">{t.name}</h3>
            <p className="mt-1 text-xs text-brand-gray-400">{t.category}</p>
            <p className="mt-2 text-sm text-brand-gray-500">{t.description}</p>
            <p className="mt-2 text-xs font-medium text-brand-gray-400">
              Use case: {t.useCase}
            </p>
            {t.iUseThis && (
              <span className="mt-3 inline-flex rounded-full bg-brand-violet/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-violet">
                I Use This
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
