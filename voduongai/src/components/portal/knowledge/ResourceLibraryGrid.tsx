import Link from "next/link";
import { Sparkles, Wrench, LayoutTemplate, Workflow, ListChecks, ClipboardList, BookOpen, FolderCheck } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { ResourceLibraryItem } from "@/data/portal/knowledge-hub";

const ICON_MAP: Record<string, typeof Sparkles> = {
  Prompt: Sparkles,
  "Công cụ AI": Wrench,
  Template: LayoutTemplate,
  Workflow: Workflow,
  Checklist: ListChecks,
  SOP: ClipboardList,
  Ebook: BookOpen,
  "Case Study": FolderCheck,
};

/**
 * Answers: "Khi tôi cần một loại tài nguyên cụ thể, tôi tìm ở đâu?"
 */
export function ResourceLibraryGrid({ items }: { items: ResourceLibraryItem[] }) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-white">Thư viện AI</h2>
        <Link href="/portal/library" className="text-sm font-semibold text-[#22D3EE] hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((r) => {
          const Icon = ICON_MAP[r.label] ?? Sparkles;
          return (
            <Link key={r.id} href={r.href} className="block">
              <GemCard className="flex flex-col items-center gap-2 py-5 text-center transition hover:-translate-y-1">
                <Icon className="h-5 w-5 text-[#22D3EE]" />
                <span className="text-xs font-semibold text-white">{r.label}</span>
              </GemCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
