import { ArrowRight } from "lucide-react";

/** Feature 07 — Real Example: Before → After (hoặc Sai → Đúng, Không AI → Có AI). */
export function RealExample({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Trước</p>
        <p className="text-sm text-gray-600">{before}</p>
      </div>
      <ArrowRight className="mx-auto hidden h-5 w-5 shrink-0 text-gray-300 sm:block" />
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">Sau</p>
        <p className="text-sm text-gray-700">{after}</p>
      </div>
    </div>
  );
}
