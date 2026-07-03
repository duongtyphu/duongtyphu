import { ArrowUpRight } from "lucide-react";

/** Feature 13 — Next Action: "Việc bạn nên làm tiếp theo", không phải "Bài liên quan". */
export function NextActionCard({ action }: { action: string }) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-5">
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-500">
        <ArrowUpRight className="h-3.5 w-3.5" />
        Việc bạn nên làm tiếp theo
      </p>
      <p className="text-sm font-semibold text-gray-800">{action}</p>
    </div>
  );
}
